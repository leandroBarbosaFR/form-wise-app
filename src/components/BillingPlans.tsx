"use client";

import { useEffect, useState } from "react";
import { CheckCircle, Gift } from "lucide-react";

type StripePrice = {
  id: string;
  name: string;
  amount: string;
  interval: "month" | "year";
  description: string;
};

export default function BillingPlans() {
  const [prices, setPrices] = useState<StripePrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [redirectingPlan, setRedirectingPlan] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrices = async () => {
      const res = await fetch("/api/stripe/stripe-prices");
      const json = await res.json();

      console.log("🎯 Résultat de /api/stripe-prices:", json);

      if (json.success && Array.isArray(json.data)) {
        setPrices(json.data);
      } else {
        console.error("❌ Aucune donnée reçue ou erreur");
      }

      setLoading(false);
    };

    fetchPrices();
  }, []);

  const handleCheckout = async (plan: "monthly" | "yearly") => {
    console.log("🚀 Début checkout pour:", plan);
    setRedirectingPlan(plan);

    try {
      console.log("📤 Envoi de la requête à /api/create-checkout-session");

      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan }),
      });

      console.log("📥 Réponse reçue:", {
        status: res.status,
        statusText: res.statusText,
        ok: res.ok,
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("❌ Erreur serveur:", {
          status: res.status,
          statusText: res.statusText,
          body: errorText,
        });

        // Essayer de parser comme JSON si possible
        try {
          const errorJson = JSON.parse(errorText);
          console.error("📋 Détails de l'erreur:", errorJson);
        } catch {
          console.error("📋 Réponse brute:", errorText);
        }

        setRedirectingPlan(null);
        return;
      }

      const data = await res.json();
      console.log("✅ Données reçues:", data);

      if (data.url) {
        console.log("🔗 Redirection vers:", data.url);
        window.location.href = data.url;
      } else {
        console.error("❌ Pas d'URL dans la réponse:", data);
        setRedirectingPlan(null);
      }
    } catch (error) {
      console.error("💥 Erreur lors de la requête:", error);
      setRedirectingPlan(null);
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Chargement des offres...</div>;
  }

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl sm:text-center">
          <h2 className="text-base font-semibold text-indigo-600">
            Abonnement
          </h2>
          <p className="mt-2 text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
            Choisissez votre forfait Formwise
          </p>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-lg font-medium text-gray-600 sm:text-center">
          Débloquez toutes les fonctionnalités pour votre établissement.
        </p>

        <div className="mt-20 flow-root">
          <div className="isolate -mt-16 grid max-w-sm grid-cols-1 gap-y-16 divide-y divide-gray-100 sm:mx-auto lg:-mx-8 lg:mt-0 lg:max-w-none lg:grid-cols-2 lg:divide-x lg:divide-y-0 xl:-mx-4">
            {prices.map((tier) => (
              <div key={tier.id} className="pt-16 lg:px-8 lg:pt-0 xl:px-14">
                <h3
                  id={tier.id}
                  className="text-base font-semibold text-gray-900"
                >
                  {tier.name}
                </h3>
                <p className="mt-6 flex items-baseline gap-x-1">
                  <span className="text-5xl font-semibold tracking-tight text-gray-900">
                    {tier.amount}
                  </span>
                  <span className="text-sm font-semibold flex items-center gap-2 text-gray-600">
                    /{tier.interval === "year" ? "an - 2 mois offerts" : "mois"}
                    {tier.interval === "year" && (
                      <Gift className="w-4 h-4 text-gray-600" />
                    )}
                  </span>
                </p>
                <p className="mt-3 text-sm text-gray-500">{tier.description}</p>
                <button
                  onClick={() =>
                    handleCheckout(
                      tier.interval === "year" ? "yearly" : "monthly"
                    )
                  }
                  disabled={redirectingPlan !== null}
                  className="mt-10 w-full rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {redirectingPlan ===
                  (tier.interval === "year" ? "yearly" : "monthly")
                    ? "Redirection..."
                    : "Choisir cette formule"}
                </button>
                <ul
                  role="list"
                  className="mt-6 space-y-3 text-sm text-gray-600"
                >
                  <li className="flex gap-x-3">
                    <CheckCircle className="h-5 w-5 text-indigo-600" /> Accès
                    multi-utilisateurs
                  </li>
                  <li className="flex gap-x-3">
                    <CheckCircle className="h-5 w-5 text-indigo-600" /> Toutes
                    les fonctionnalités
                  </li>
                  <li className="flex gap-x-3">
                    <CheckCircle className="h-5 w-5 text-indigo-600" /> Support{" "}
                    {tier.interval === "year" ? "24h" : "48h"}
                  </li>
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
