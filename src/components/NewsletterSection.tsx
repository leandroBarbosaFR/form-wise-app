"use client";

import { useState } from "react";
import { toast } from "sonner"; // ou remplace par ton système de toast

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Merci ! Vous êtes inscrit à la newsletter.");
        setEmail("");
      } else {
        toast.error(data.error || "Erreur lors de l'inscription.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Erreur réseau.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="relative isolate flex flex-col gap-10 overflow-hidden bg-gray-900 px-6 py-24 shadow-2xl sm:rounded-3xl sm:px-24 xl:flex-row xl:items-center xl:py-32">
          <h2 className="max-w-xl text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl xl:flex-auto">
            Inscrivez-vous à notre newsletter pour rester informé des mises à
            jour et nouvelles fonctionnalités de Formwise.
          </h2>

          <form onSubmit={handleSubmit} className="w-full max-w-md">
            <div className="flex gap-x-4">
              <label htmlFor="email-address" className="sr-only">
                Adresse e-mail
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                required
                placeholder="Entrez votre adresse e-mail"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="min-w-0 flex-auto rounded-md bg-white/5 px-3.5 py-2 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-white sm:text-sm/6"
              />
              <button
                type="submit"
                disabled={loading}
                className="flex-none rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white cursor-pointer"
              >
                {loading ? "Envoi..." : "Me notifier"}
              </button>
            </div>

            <p className="mt-4 text-sm text-gray-300">
              Nous respectons votre vie privée.{" "}
              <a
                href="/politique-confidentialite"
                className="underline hover:text-white"
              >
                Consultez notre politique de confidentialité.
              </a>
            </p>
          </form>

          {/* le SVG décoratif reste inchangé */}
        </div>
      </div>
    </div>
  );
}
