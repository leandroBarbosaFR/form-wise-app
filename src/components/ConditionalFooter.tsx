"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import SiteFooter from "./SiteFooter";

export default function ConditionalFooter() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDashboard =
    pathname?.startsWith("/dashboard") ||
    pathname?.startsWith("/app") ||
    pathname?.startsWith("/login") ||
    pathname?.startsWith("/register") ||
    pathname?.startsWith("/admin");

  if (isDashboard) return null;

  return <SiteFooter />;
}
