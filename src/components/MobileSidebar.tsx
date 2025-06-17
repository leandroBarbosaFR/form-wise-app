"use client";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Dispatch, SetStateAction } from "react";
import { signOut, useSession } from "next-auth/react";
import { DashboardSection } from "../types/types";
import { LogOut } from "lucide-react";

type Section = {
  key: DashboardSection;
  label: string;
};

const getSections = (role?: string): Section[] => {
  if (role === "PARENT") {
    return [
      { key: "children", label: "Mes enfants" },
      { key: "notification", label: "Notifications" },
      { key: "rib", label: "Coordonnées bancaires" },
    ];
  }

  if (role === "DIRECTOR") {
    return [
      { key: "schoolYear", label: "Année scolaire" },
      { key: "classes", label: "Classes" },
      { key: "subjects", label: "Matières" },
      { key: "teachers", label: "Professeurs" },
      { key: "notification", label: "Notification" },
      { key: "eleves", label: "Éleves" },
      { key: "charts", label: "Graphiques" },
    ];
  }

  if (role === "TEACHER") {
    return [
      { key: "myProfile", label: "Mon Profil" },
      { key: "infos", label: "Ma classe & matière" },
      { key: "eleves", label: "Élèves" },
      { key: "notifications", label: "Notifications" },
    ];
  }

  return [];
};

export default function MobileSidebar({
  activeSection,
  setActiveSection,
}: {
  activeSection: DashboardSection;
  setActiveSection: Dispatch<SetStateAction<DashboardSection>>;
}) {
  const { data: session } = useSession();
  const role = session?.user?.role;
  const sections = getSections(role);

  return (
    <div className="fixed top-4 right-4 z-50 md:hidden p-4">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="cursor-pointer">
            ☰ Menu
          </Button>
        </SheetTrigger>
        <SheetContent className="p-4" side="left">
          <SheetTitle className="text-lg font-semibold mb-4">Menu</SheetTitle>
          <div className="flex flex-col gap-4 mt-4">
            {sections.map((section) => (
              <Button
                key={section.key}
                variant={activeSection === section.key ? "default" : "ghost"}
                onClick={() => setActiveSection(section.key)}
                className="cursor-pointer"
              >
                {section.label}
              </Button>
            ))}
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              Se déconnecter <LogOut />
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
