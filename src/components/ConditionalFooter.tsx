"use client";

import { usePathname } from "next/navigation";
import SiteFooter from "./SiteFooter";

export default function ConditionalFooter() {
  const pathname = usePathname();

  // Ne pas afficher le footer sur les routes dashboard ou app protégées
  const isDashboard =
    pathname?.startsWith("/dashboard") || pathname?.startsWith("/app");

  if (isDashboard) return null;

  return <SiteFooter />;
}
