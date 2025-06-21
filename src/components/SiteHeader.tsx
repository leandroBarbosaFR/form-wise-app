"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Zap, Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import NavDrawerMobile from "./NavDrawerMobile";

const navigation = [
  { name: "Contactez-nous", href: "/contact" },
  // { name: "Fonctionnalités", href: "#" },
];

export default function SiteHeader() {
  const [showSticky, setShowSticky] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setShowSticky(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (pathname?.startsWith("/dashboard") || pathname?.startsWith("/app")) {
    return null;
  }

  return (
    <>
      <header className="absolute inset-x-0 top-0 z-50 mt-8">
        {/* Sticky Header */}
        {showSticky && (
          <div className="fixed top-4 left-1/2 z-40 -translate-x-1/2 w-[90%] max-w-6xl rounded-full bg-white/10 backdrop-blur-3xl backdrop-saturate-200 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.3)] ring-1 ring-white/20 transition-all duration-300">
            <div className="flex items-center justify-between px-6 py-1 lg:py-3">
              <Link href="/" className="flex items-center gap-2 font-semibold text-gray-900">
                <Zap className="h-5 w-5" />
                Formwise
              </Link>

              <div className="hidden lg:flex gap-6 items-center">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-sm font-semibold text-gray-900 hover:text-indigo-600 transition"
                  >
                    {item.name}
                  </Link>
                ))}
                <Link href="/login" className="text-sm font-semibold text-gray-900 hover:text-indigo-600">
                  Connexion →
                </Link>
              </div>

              <div className="flex lg:hidden">
                <button
                  onClick={() => setMobileMenuOpen(true)}
                  className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-white/10 transition"
                >
                  <span className="sr-only">Ouvrir le menu</span>
                  <Menu className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Normal Header */}
        <div className="flex items-center justify-between p-6 lg:px-8">
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2 -m-1.5 p-1.5">
              <Zap className="h-5 w-5" />
              <span className="font-semibold text-gray-900">Formwise</span>
            </Link>
          </div>

          <nav className="flex items-center gap-6">
            <div className="hidden lg:flex lg:gap-x-12">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm font-semibold text-gray-900 hover:text-indigo-600 transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            <div className="hidden lg:flex">
              <Link href="/login" className="text-sm font-semibold text-gray-900 hover:text-indigo-600">
                Connexion →
              </Link>
            </div>

            <div className="flex lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              >
                <span className="sr-only">Menu mobile</span>
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </nav>
        </div>
      </header>

      <NavDrawerMobile open={mobileMenuOpen} onClose={setMobileMenuOpen} />
    </>
  );
}
