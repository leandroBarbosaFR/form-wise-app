import type { Metadata } from "next";
import HeroSection from "../components/HeroSection";
import FeatureSection from "../components/FeatureSection";
import PricingSection from "../components/PricingSection";
import Banner from "../components/Banner";
import NewsletterSection from "../components/NewsletterSection";
import SiteFooter from "../components/SiteFooter";

export const metadata: Metadata = {
  title: "FormWise",
  description: "Connexion à Form Wise",
};

export default function RegisterPage() {
  return (
    <>
      <Banner />
      <HeroSection />
      <FeatureSection />
      <PricingSection />
      <NewsletterSection />
      <SiteFooter />
    </>
  );
}
