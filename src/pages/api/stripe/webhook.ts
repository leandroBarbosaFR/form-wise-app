import { buffer } from "micro";
import { NextApiRequest, NextApiResponse } from "next";
import { stripe } from "../../../lib/stripe";
import { prisma } from "../../../lib/prisma";
import Stripe from "stripe";

export const config = {
  api: {
    bodyParser: false, // ⚠️ obligatoire pour Stripe
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).end("Method Not Allowed");
  }

  const sig = req.headers["stripe-signature"] as string;

  let event: Stripe.Event;

  try {
    const rawBody = await buffer(req);
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("❌ Invalid Stripe signature:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    return res.status(400).send("Webhook Error");
  }

  console.log("✅ Stripe Event:", event.type);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const tenantId = session.metadata?.tenantId;
    const subscriptionId = session.subscription as string;
    const customerId = session.customer as string;

    if (!tenantId || !customerId || !subscriptionId) {
      return res.status(400).send("Missing data");
    }

    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const billingInterval =
      subscription.items.data[0]?.price?.recurring?.interval;
    const billingPlan = billingInterval === "year" ? "YEARLY" : "MONTHLY";

    await prisma.tenant.update({
      where: { id: tenantId },
      data: {
        subscriptionStatus: "ACTIVE",
        billingPlan,
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscriptionId,
        trialEndsAt: null,
      },
    });

    console.log("✅ Tenant updated:", tenantId);
  }

  res.status(200).json({ received: true });
}
