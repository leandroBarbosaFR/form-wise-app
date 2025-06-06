"use client";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Dispatch, SetStateAction } from "react";
import { signOut } from "next-auth/react";
import { DashboardSection } from "../types/types"; // Add this import

type Section = {
  key: DashboardSection; // Change from string to DashboardSection
  label: string;
};

const sections: Section[] = [
  { key: "schoolYear", label: "Année scolaire" },
  { key: "classes", label: "Classes" },
  { key: "subjects", label: "Matières" },
  { key: "teachers", label: "Professeurs" },
  // Tu pourras ajouter ici : { key: "teachers", label: "Professeurs" }
];

export default function MobileSidebar({
  activeSection,
  setActiveSection,
}: {
  activeSection: DashboardSection; // Change from string to DashboardSection
  setActiveSection: Dispatch<SetStateAction<DashboardSection>>; // Change from string to DashboardSection
}) {
  return (
    <div className="fixed top-4 left-4 z-50 md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">☰ Menu</Button>
        </SheetTrigger>
        <SheetContent side="left">
          <SheetTitle className="text-lg font-semibold mb-4">
            📂 Menu
          </SheetTitle>
          <div className="flex flex-col gap-4 mt-4">
            {sections.map((section) => (
              <Button
                key={section.key}
                variant={activeSection === section.key ? "default" : "ghost"}
                onClick={() => setActiveSection(section.key)}
              >
                {section.label}
              </Button>
            ))}
            <Button
              variant="outline"
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              Se déconnecter
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
