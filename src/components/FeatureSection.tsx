"use client";

import { UserPlus, MessagesSquare, Fingerprint, Landmark } from "lucide-react";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    name: "Inscriptions centralisées",
    description:
      "Gagnez du temps avec un système d’inscription moderne, simple et sécurisé. Les parents ajoutent leurs enfants, les directeurs valident en un seul endroit.",
    icon: UserPlus,
  },
  {
    name: "Paiements simplifiés",
    description:
      "Chaque parent reçoit une notification automatique pour régler les frais scolaires. Paiement par virement, chèque ou prélèvement à venir.",
    icon: Landmark,
  },
  {
    name: "Communication fluide",
    description:
      "Envoyez un message à tous les parents, ou à un seul élève (“Prenez une gourde demain”) — tout est possible depuis le tableau de bord directeur.",
    icon: MessagesSquare,
  },
  {
    name: "Rôles et accès sécurisés",
    description:
      "Parents, professeurs, directeurs : chacun accède uniquement aux infos qui le concernent, avec une interface dédiée et facile à utiliser.",
    icon: Fingerprint,
  },
];

export default function FeatureSection() {
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    itemsRef.current.forEach((item, index) => {
      if (item) {
        gsap.fromTo(
          item,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: index * 0.15,
            ease: "power2.out",
            scrollTrigger: {
              trigger: item,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    });
  }, []);

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base/7 font-semibold text-indigo-600">
            Fonctionnalités Formwise
          </h2>
          <p className="mt-2 text-pretty text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl lg:text-balance">
            Gérez votre établissement plus simplement, dès aujourd’hui.
          </p>
          <p className="mt-6 text-lg/8 text-gray-600">
            Tout ce qu’il vous faut, réuni dans une seule plateforme.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            {features.map((feature, index) => (
              <div
                key={feature.name}
                className="relative pl-16"
                ref={(el) => {
                  itemsRef.current[index] = el;
                }}
              >
                <dt className="text-base/7 font-semibold text-gray-900">
                  <div className="absolute left-0 top-0 flex size-10 items-center justify-center rounded-lg bg-indigo-600">
                    <feature.icon
                      aria-hidden="true"
                      className="size-6 text-white"
                    />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-2 text-base/7 text-gray-600">
                  {feature.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
