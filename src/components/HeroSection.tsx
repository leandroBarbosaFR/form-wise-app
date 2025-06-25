"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import TabsShowcase from "./TabsShowcase";
import { Zap } from "lucide-react";

export default function HeroSection() {
  const titleRef = useRef(null);
  const paragraphRef = useRef(null);
  const buttonsRef = useRef(null);

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
    <section
      className="bg-white relative isolate pt-14"
      aria-label="Introduction Formwise"
    >
      {/* Backgrounds */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
      >
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] 
            -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr 
            from-[#ff80b5] to-[#9089fc] opacity-30 
            sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>

      <div className="py-24 sm:py-32 lg:pb-40">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto text-center">
            <h1
              ref={titleRef}
              className="fancy-gradient-text text-balance text-5xl sm:text-7xl leading-[57px] sm:leading-[83px] font-semibold tracking-tight text-gray-900"
            >
              Plateforme SaaS pour centraliser, simplifier et{" "}
              <span className="fancy-gradient-span">gagner du temps.</span>
            </h1>
            <p
              ref={paragraphRef}
              className="fancy-gradient-text mt-8 text-pretty text-lg font-medium text-gray-500 sm:text-xl/8"
            >
              Formwise vous aide à digitaliser et fiabiliser les inscriptions
              scolaires pour les établissements et les familles.
            </p>
            <div
              ref={buttonsRef}
              className="mt-10 flex items-center justify-center gap-x-6"
            >
              <Link href="/register/free-trial" target="_blank">
                <Button className="cursor-pointer">
                  <Zap />
                  Profitez de 20 jours gratuitement
                </Button>
              </Link>
              <Link
                href="https://calendly.com/hello1367studio/30min"
                target="_blank"
              >
                <Button className="cursor-pointer" variant="outline">
                  Réserver une démo
                </Button>
              </Link>
            </div>
          </div>

          {/* Screenshot or demo */}
          <TabsShowcase />
        </div>
      </div>

      {/* Second background */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
      >
        <div
          className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] 
            -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 
            sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>
    </section>
  );
}
