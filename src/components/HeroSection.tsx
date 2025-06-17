"use client";

import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Zap } from "lucide-react";
import gsap from "gsap";

const navigation = [
  { name: "Contactez-nous", href: "/contact" },
  // { name: "Features", href: "#" },
  // { name: "Marketplace", href: "#" },
  // { name: "Company", href: "#" },
];

export default function HeroSection() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const titleRef = useRef(null);
  const paragraphRef = useRef(null);
  const buttonsRef = useRef(null);
  const [showStickyHeader, setShowStickyHeader] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowStickyHeader(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

    tl.fromTo(
      titleRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1 }
    )
      .fromTo(
        paragraphRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8 },
        "-=0.6"
      )
      .fromTo(
        buttonsRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8 },
        "-=0.5"
      );
  }, []);
  return (
    <div className="bg-white">
      <header className="absolute inset-x-0 top-0 z-50 mt-8">
        {showStickyHeader && (
          <div
            className="fixed top-4 left-1/2 z-40 -translate-x-1/2 w-[90%] max-w-6xl
               rounded-full bg-white/10 backdrop-blur-3xl backdrop-saturate-200
               shadow-[inset_0_0_0_1px_rgba(255,255,255,0.3)]
               ring-1 ring-red transition-all duration-300"
          >
            <div className="flex items-center justify-between px-6 py-3">
              <Link
                href="/"
                className="flex items-center gap-2 font-semibold text-gray-900"
              >
                <Zap className="h-5 w-5" />
                Formwise
              </Link>
              <div className="hidden lg:flex gap-6 items-center">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-sm font-semibold text-gray-900 hover:text-indigo-200 transition-colors"
                  >
                    {item.name}
                  </a>
                ))}
                <a
                  href="/login"
                  className="text-sm font-semibold text-gray-900 hover:text-indigo-200"
                >
                  Connexion <span aria-hidden="true">&rarr;</span>
                </a>
              </div>
            </div>
          </div>
        )}
        <nav
          aria-label="Global"
          className="flex items-center justify-between p-6 lg:px-8"
        >
          {/* Logo à gauche */}
          <div className="flex flex-1">
            <a href="#" className="-m-1.5 p-1.5 flex gap-2 items-center">
              <Zap />
              <span className="font-semibold">Formwise</span>
            </a>
          </div>
          <div className="hidden lg:flex flex-1 gap-4 justify-end">
            <div className="hidden lg:flex lg:gap-x-12">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-sm font-semibold text-gray-900 hover:text-indigo-600 transition-colors duration-200"
                >
                  {item.name}
                </a>
              ))}
            </div>
            <a
              href="/login"
              className="text-sm font-semibold text-gray-900 hover:text-indigo-600 transition-colors duration-200"
            >
              Connexion <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
          {/* Menu mobile */}
          <div className="flex lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Open main menu</span>
              <Menu aria-hidden="true" className="size-6" />
            </button>
          </div>
        </nav>
        <Dialog open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <DialogContent className="inset-y-0 right-0 w-full max-w-sm p-6 lg:hidden">
            <DialogHeader>
              <DialogTitle className="sr-only">Menu mobile</DialogTitle>
            </DialogHeader>
            <div className="flex items-center justify-between">
              <a href="#" className="-m-1.5 p-1.5">
                <span className="sr-only">FormWise</span>
                <Image
                  alt=""
                  src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                  className="h-8 w-auto"
                  width={600}
                  height={600}
                />
              </a>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="-m-2.5 rounded-md p-2.5 text-gray-700 cursor-pointer"
              >
                <span className="sr-only">Fermer</span>
                <X className="size-6" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
                <div className="py-6">
                  <a
                    href="/login"
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold text-gray-900 hover:bg-gray-50"
                  >
                    Connexion
                  </a>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </header>

      <div className="relative isolate pt-14">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        >
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          />
        </div>
        <div className="py-24 sm:py-32 lg:pb-40">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h1
                ref={titleRef}
                className="text-balance text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl"
              >
                Inscription simplifiée pour tous.
              </h1>
              <p
                ref={paragraphRef}
                className="mt-8 text-pretty text-lg font-medium text-gray-500 sm:text-xl/8"
              >
                Avec notre solution, gérez les inscriptions de manière simple,
                rapide et efficace.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link
                  href="https://calendly.com/hello1367studio/30min"
                  target="_blank"
                >
                  <Button ref={buttonsRef} className="cursor-pointer">
                    Réserver une démo
                  </Button>
                </Link>
                <Link href="https://wa.me/+330763858388" target="_blank">
                  <Button
                    ref={buttonsRef}
                    className="cursor-pointer"
                    variant="outline"
                  >
                    Nous contacter
                  </Button>
                </Link>
              </div>
            </div>
            <div className="mt-16 flow-root sm:mt-24">
              <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
                <Image
                  alt="App screenshot"
                  src="https://cdn.sanity.io/media-libraries/mllo1PEUbcwG/images/b3044cc91f7cc72b23289c22d2d5be98507edd76-5096x2668.png"
                  width={2432}
                  height={1442}
                  className="rounded-md shadow-2xl ring-1 ring-gray-900/10"
                />
              </div>
            </div>
          </div>
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
        >
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          />
        </div>
      </div>
    </div>
  );
}
