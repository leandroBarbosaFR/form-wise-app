import type { Metadata } from "next";
import HeroSection from "../components/HeroSection";
import FeatureSection from "../components/FeatureSection";
import PricingSection from "../components/PricingSection";
import NewsletterSection from "../components/NewsletterSection";

export const metadata: Metadata = {
  title: "Formwise – Simplifiez les inscriptions scolaires",
  description:
    "Formwise est une plateforme SaaS qui facilite la gestion des inscriptions scolaires pour les parents, enseignants et directeurs.",
  openGraph: {
    title: "Formwise – Simplifiez les inscriptions scolaires",
    description:
      "Gérez facilement les inscriptions scolaires grâce à Formwise, une plateforme intuitive pour parents, enseignants et directeurs.",
    url: "https://formwise.fr",
    siteName: "Formwise",
    images: [
      {
        url: "https://cdn.sanity.io/media-libraries/mllo1PEUbcwG/images/35725892e60683e485309d70c9c5bd5a6b517a6a-1536x1024.png",
        width: 1200,
        height: 630,
        alt: "Aperçu de Formwise",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Formwise – Simplifiez les inscriptions scolaires",
    description:
      "La plateforme idéale pour les écoles, parents et professeurs.",
    images: [
      "https://cdn.sanity.io/media-libraries/mllo1PEUbcwG/images/35725892e60683e485309d70c9c5bd5a6b517a6a-1536x1024.png",
    ],
  },
};

export default function RegisterPage() {
  return (
    <>
      <HeroSection />
      <FeatureSection />
      <PricingSection />
      <NewsletterSection />
    </>
  );
}
