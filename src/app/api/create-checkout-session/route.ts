// /api/create-checkout-session/route.ts
import { stripe } from "../../../lib/stripe";
import { prisma } from "../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/authOptions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    console.log("🚀 Début de la création de session checkout");

    const session = await getServerSession(authOptions);
    if (!session) {
      console.log("❌ Pas de session utilisateur");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "DIRECTOR") {
      console.log("❌ Rôle non autorisé:", session.user.role);
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const selectedPlan: "monthly" | "yearly" = body.plan || "monthly";
    console.log("📋 Plan sélectionné:", selectedPlan);

    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      include: { tenant: true },
    });

    if (!user || !user.tenant) {
      console.log("❌ Utilisateur ou tenant non trouvé");
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    const tenant = user.tenant;
    let stripeCustomerId = tenant.stripeCustomerId;

    if (!stripeCustomerId) {
      console.log("🏗️ Création d'un nouveau customer Stripe");
      const customer = await stripe.customers.create({
        email: user.email!,
        name: `${user.firstName} ${user.lastName}`,
        metadata: { tenantId: tenant.id },
      });

      await prisma.tenant.update({
        where: { id: tenant.id },
        data: { stripeCustomerId: customer.id },
      });

      stripeCustomerId = customer.id;
      console.log("✅ Customer Stripe créé:", stripeCustomerId);
    }

    // ✅ Récupérer les prix avec lookup keys
    const prices = await stripe.prices.list({
      lookup_keys: ["formwise-monthly", "formwise-yearly"],
      expand: ["data.product"],
    });

    console.log(
      "💰 Prix récupérés:",
      prices.data.map((p) => ({
        id: p.id,
        lookup_key: p.lookup_key,
        interval: p.recurring?.interval,
        active: p.active,
      }))
    );

    // Trouver le bon prix selon le plan
    const lookupKey =
      selectedPlan === "monthly" ? "formwise-monthly" : "formwise-yearly";
    const targetPrice = prices.data.find(
      (price) => price.lookup_key === lookupKey
    );

    if (!targetPrice) {
      console.log("❌ Prix non trouvé pour le plan:", selectedPlan);
      console.log(
        "❌ Prix disponibles:",
        prices.data.map((p) => p.lookup_key)
      );
      return NextResponse.json({ error: "Prix non trouvé" }, { status: 404 });
    }

    if (!targetPrice.active) {
      console.log("❌ Prix inactif:", targetPrice.id);
      return NextResponse.json({ error: "Prix inactif" }, { status: 400 });
    }

    console.log("🎯 Prix sélectionné:", {
      id: targetPrice.id,
      lookup_key: targetPrice.lookup_key,
      interval: targetPrice.recurring?.interval,
      amount: targetPrice.unit_amount,
      active: targetPrice.active,
    });

    // ✅ Gestion URL compatible localhost
    const baseUrl =
      process.env.NODE_ENV === "production"
        ? process.env.NEXT_PUBLIC_APP_URL
        : "http://localhost:3000";

    console.log("🌍 Environment:", process.env.NODE_ENV);
    console.log("🔗 Base URL:", baseUrl);

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ["card"],
      line_items: [
        {
          price: targetPrice.id,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${baseUrl}/dashboard/billing?session_id={CHECKOUT_SESSION_ID}&success=true`,
      cancel_url: `${baseUrl}/dashboard/billing?canceled=true`,
      metadata: {
        tenantId: tenant.id,
        userId: user.id,
        plan: selectedPlan,
        priceId: targetPrice.id,
        environment: process.env.NODE_ENV || "development",
      },
      allow_promotion_codes: true,
      billing_address_collection: "required",
    });

    console.log("✅ Session Stripe créée:", {
      sessionId: checkoutSession.id,
      url: checkoutSession.url,
      customer: stripeCustomerId,
      priceId: targetPrice.id,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("💥 [STRIPE_CHECKOUT_SESSION_ERROR]", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
