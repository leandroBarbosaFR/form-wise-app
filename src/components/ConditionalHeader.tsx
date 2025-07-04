"use client";

import { usePathname } from "next/navigation";
import SiteHeader from "./SiteHeader";

export default function ConditionalHeader() {
  const pathname = usePathname();

  // Ne pas afficher le footer sur les routes dashboard ou app protégées
  const isDashboard =
    pathname?.startsWith("/dashboard") ||
    pathname?.startsWith("/app") ||
    pathname?.startsWith("/register") ||
    pathname?.startsWith("/login") ||
    pathname?.startsWith("/preinscription-success") ||
    pathname?.startsWith("/preinscription") ||
    pathname?.startsWith("/admin");

  if (isDashboard) return null;

  return <SiteHeader />;
}
