"use client";

import { usePathname } from "next/navigation";
import SiteHeader from "./SiteHeader";

export default function ConditionalHeader() {
  const pathname = usePathname();

  // Ne pas afficher le footer sur les routes dashboard ou app protégées
  const isDashboard =
    pathname?.startsWith("/dashboard") ||
    pathname?.startsWith("/app") ||
    pathname?.startsWith("/admin");

  if (isDashboard) return null;

  return <SiteHeader />;
}
