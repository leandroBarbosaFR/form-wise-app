import React from "react";
import ContactFormPage from "components/ContactFormPage";

export const metadata = {
  title: "Contactez-nous – Formwise",
  description:
    "Une question ? Contactez l'équipe Formwise via notre formulaire ou WhatsApp. Nous vous répondrons rapidement.",
};

export default function contact() {
  return (
    <>
      <ContactFormPage />
    </>
  );
}
