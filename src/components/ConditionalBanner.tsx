"use client";

import { usePathname } from "next/navigation";
import Banner from "./Banner";

export default function ConditionalBanner() {
  const pathname = usePathname();

  // Ne pas afficher le footer sur les routes dashboard ou app protégées
  const isDashboard =
    pathname?.startsWith("/dashboard") ||
    pathname?.startsWith("/app") ||
    pathname?.startsWith("/register") ||
    pathname?.startsWith("/login") ||
    pathname?.startsWith("/admin");

  if (isDashboard) return null;

  return <Banner />;
}
