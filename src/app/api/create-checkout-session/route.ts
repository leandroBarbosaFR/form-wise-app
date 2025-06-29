import { stripe } from "../../../lib/stripe";
import { prisma } from "../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/authOptions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "DIRECTOR") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const selectedPlan: "monthly" | "yearly" = body.plan || "monthly";

    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      include: { tenant: true },
    });

    if (!user || !user.tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    const tenant = user.tenant;
    let stripeCustomerId = tenant.stripeCustomerId;

    if (!stripeCustomerId) {
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
    }

    const priceId =
      selectedPlan === "yearly"
        ? process.env.STRIPE_PRICE_YEARLY
        : process.env.STRIPE_PRICE_MONTHLY;

    // ✅ Vérification et nettoyage de l'URL
    const rawAppUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (!rawAppUrl || !rawAppUrl.startsWith("https://")) {
      console.error(
        "❌ NEXT_PUBLIC_APP_URL invalide ou manquante :",
        rawAppUrl
      );
      return NextResponse.json({ error: "Invalid app URL" }, { status: 500 });
    }
    const appUrl = rawAppUrl.replace(/\/+$/, ""); // remove trailing slash

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId!,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${appUrl}/dashboard?success=true`,
      cancel_url: `${appUrl}/dashboard?canceled=true`,
      metadata: {
        tenantId: tenant.id,
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("[STRIPE_CHECKOUT_SESSION_ERROR]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
