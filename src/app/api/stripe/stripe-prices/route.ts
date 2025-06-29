// /api/stripe/stripe-prices/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function GET() {
  try {
    // ✅ Utiliser les lookup keys que vous avez configurés
    const prices = await stripe.prices.list({
      lookup_keys: ["test", "formwise-yearly"], // Vos lookup keys actuels
      expand: ["data.product"],
    });

    console.log(
      "✅ Prix récupérés avec lookup keys:",
      prices.data.map((p) => ({
        id: p.id,
        lookup_key: p.lookup_key,
        nickname: p.nickname,
        active: p.active,
        amount: p.unit_amount,
      }))
    );

    const data = prices.data.map((price) => {
      const product = price.product as Stripe.Product;

      return {
        id: price.id,
        name: price.nickname ?? product.name,
        amount: (price.unit_amount! / 100).toFixed(0) + "€",
        interval: price.recurring?.interval,
        description: product.description ?? "",
        lookup_key: price.lookup_key, // ✅ Inclure le lookup key pour debug
        active: price.active, // ✅ Inclure le statut actif
      };
    });

    console.log("📋 Données formatées:", data);

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("❌ Stripe price fetch error:", err);
    return NextResponse.json(
      { success: false, error: "Erreur Stripe" },
      { status: 500 }
    );
  }
}
