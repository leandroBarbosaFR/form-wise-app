import { Suspense } from "react";
import ClientWrapper from "../../components/pre-inscription/ClientWrapper";

export default function PreinscriptionPage() {
  return (
    <Suspense
      fallback={
        <div className="text-center py-10 text-gray-500">
          Chargement du formulaire...
        </div>
      }
    >
      <ClientWrapper />
    </Suspense>
  );
}
