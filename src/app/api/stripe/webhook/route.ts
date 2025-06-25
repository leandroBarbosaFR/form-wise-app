import { stripe } from "../../../../lib/stripe";
import { prisma } from "../../../../lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature") as string;
  const body = await req.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("❌ Webhook signature error:", err.message);
      return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
    }
    return new NextResponse("Webhook Error", { status: 400 });
  }

  console.log(`🎯 Stripe Event Received: ${event.type}`);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    console.log("🧾 Stripe session metadata:", session.metadata);
    console.log("🆔 Subscription ID:", session.subscription);
    console.log("👤 Customer:", session.customer);
    console.log("🎯 SESSION OBJECT:", session);

    const tenantId = session.metadata?.tenantId;
    const subscriptionId = session.subscription as string;

    if (!tenantId) {
      console.warn("❌ Missing tenantId in session metadata");
      return new NextResponse("Missing tenantId", { status: 400 });
    }

    await prisma.tenant.update({
      where: { id: tenantId },
      data: {
        subscriptionStatus: "ACTIVE",
        stripeSubscriptionId: subscriptionId,
        trialEndsAt: null, // <- reset trial si besoin
      },
    });

    console.log(`✅ Subscription activated for tenant ${tenantId}`);
  }

  return new NextResponse("OK", { status: 200 });
}
