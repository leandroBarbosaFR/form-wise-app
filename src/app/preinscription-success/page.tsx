"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function PreinscriptionSuccessPage() {
  const router = useRouter();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-2xl font-bold mb-4 text-green-600">
        🎉 Pré-inscription envoyée avec succès !
      </h1>
      <p className="text-gray-600 mb-6">
        Merci pour votre demande. L&apos;établissement vous contactera très
        bientôt.
      </p>
      <Button onClick={() => router.push("/")}>Retour à l&apos;accueil</Button>
    </div>
  );
}
