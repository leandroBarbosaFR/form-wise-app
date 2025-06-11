"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Zap } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="flex items-center justify-around p-4 border-b bg-white">
        <div className="text-xl  flex lg:text-[50px] lg:leading-[56px] items-center">
          <Zap width={40} height={40} />
          Form
          <span className="text-xl font-bold text-blue-600 lg:text-[50px] lg:leading-[56px]">
            wise
          </span>
        </div>
        <div className="space-x-4">
          <Link href="/login">
            <Button variant="outline">Se connecter</Button>
          </Link>
          <Link href="/register">
            <Button>Créer un compte</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-4 bg-gradient-to-b from-white to-blue-100 min-h-[90vh]">
        <h1 className="text-3xl sm:text-4xl lg:text-[76px] lg:leading-[79px] font-bold mb-4 max-w-4xl">
          Inscription <span className="text-blue-600">simplifiée</span> pour
          tous.
        </h1>
        <p className="text-lg text-gray-700 max-w-xl mb-6">
          Avec notre solution, gérez les inscriptions de manière simple, rapide
          et efficace.
        </p>
        <div className="space-x-4">
          <Button className="cursor-pointer">Agender une démo</Button>
          <Button className="cursor-pointer" variant="outline">
            Nous contacter
          </Button>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-white text-center">
        <h2 className="text-3xl font-bold mb-10">Tarification</h2>
        <div className="grid gap-8 max-w-4xl mx-auto md:grid-cols-3">
          <div className="border p-6 rounded-xl shadow">
            <h3 className="text-xl font-semibold mb-2">Basique</h3>
            <p className="text-gray-700 mb-4">
              Gratuit pour les petites associations.
            </p>
            <p className="text-2xl font-bold">0€</p>
          </div>
          <div className="border p-6 rounded-xl shadow border-blue-600">
            <h3 className="text-xl font-semibold mb-2">Standard</h3>
            <p className="text-gray-700 mb-4">
              Pour les écoles et établissements moyens.
            </p>
            <p className="text-2xl font-bold">29€ / mois</p>
          </div>
          <div className="border p-6 rounded-xl shadow">
            <h3 className="text-xl font-semibold mb-2">Pro</h3>
            <p className="text-gray-700 mb-4">
              Pour les grandes structures et groupes scolaires.
            </p>
            <p className="text-2xl font-bold">59€ / mois</p>
          </div>
        </div>
      </section>

      {/* Fake Testimonials */}
      <section className="py-20 bg-blue-50 text-center">
        <h2 className="text-3xl font-bold mb-10">Ce qu&apos;ils en disent</h2>
        <div className="grid gap-6 max-w-4xl mx-auto md:grid-cols-3">
          <div className="bg-white p-6 rounded-xl shadow">
            <p className="italic">
              &quot;Formwise a changé notre manière de gérer les inscriptions.
              Tellement plus simple maintenant !&quot;
            </p>
            <p className="mt-4 font-semibold">Marie, directrice d&apos;école</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow">
            <p className="italic">
              &quot;Un vrai gain de temps pour tous les parents. L’interface est
              très claire.&quot;
            </p>
            <p className="mt-4 font-semibold">Jean, parent d&apos;élève</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow">
            <p className="italic">
              &quot;Simple, rapide, efficace. Nos professeurs adorent
              l&apos;outil.&quot;
            </p>
            <p className="mt-4 font-semibold">
              Julie, coordinatrice pédagogique
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 py-8 text-center text-sm text-gray-600">
        &copy; {new Date().getFullYear()} Formwise. Tous droits réservés.
      </footer>
    </div>
  );
}
