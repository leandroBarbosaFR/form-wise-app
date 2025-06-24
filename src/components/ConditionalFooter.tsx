"use client";

import { usePathname } from "next/navigation";
import SiteFooter from "./SiteFooter";

export default function ConditionalFooter() {
  const pathname = usePathname();

  // Ne pas afficher le footer sur les routes dashboard, app ou admin
  const isDashboard =
    pathname?.startsWith("/dashboard") ||
    pathname?.startsWith("/app") ||
    pathname?.startsWith("/admin");

  if (isDashboard) return null;

  return <SiteFooter />;
}
