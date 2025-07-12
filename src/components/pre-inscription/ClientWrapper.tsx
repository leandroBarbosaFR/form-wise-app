import { Suspense } from "react";
import PreRegistrationForm from "./PreRegistrationForm";

export default function PreinscriptionPage() {
  return (
    <Suspense
      fallback={
        <div className="text-center py-10 text-gray-500">
          Chargement du formulaire...
        </div>
      }
    >
      <PreRegistrationForm schoolCode={""} />
    </Suspense>
  );
}
