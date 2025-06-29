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

  console.log(`✅ Stripe Event Received: ${event.type}`);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const tenantId = session.metadata?.tenantId;
    const subscriptionId = session.subscription as string;
    const customerId = session.customer as string;

    if (!tenantId || !customerId || !subscriptionId) {
      console.warn("❌ Missing info in session metadata");
      return new NextResponse("Missing data", { status: 400 });
    }

    // Récupère la subscription pour avoir le plan
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const billingInterval =
      subscription.items.data[0]?.price?.recurring?.interval;

    const billingPlan = billingInterval === "year" ? "YEARLY" : "MONTHLY";

    await prisma.tenant.update({
      where: { id: tenantId },
      data: {
        subscriptionStatus: "ACTIVE",
        billingPlan: billingPlan,
        stripeCustomerId: customerId, // 👈 C'était ça qui manquait
        stripeSubscriptionId: subscriptionId,
        trialEndsAt: null,
      },
    });

    console.log("✅ Tenant updated:", tenantId);
  }

  return new NextResponse("OK", { status: 200 });
}
