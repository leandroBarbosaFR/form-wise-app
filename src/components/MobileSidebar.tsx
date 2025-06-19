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
import {
  CalendarDays,
  LayoutGrid,
  BookOpen,
  UserRound,
  Bell,
  Users,
  CreditCard,
  ChartPie,
  User,
  FileText,
  UserLock,
  Settings,
  LogOut,
} from "lucide-react";

type Section = {
  key: DashboardSection;
  label: string;
  icon: React.ReactNode;
};

const getSections = (role?: string): Section[] => {
  if (role === "PARENT") {
    return [
      {
        key: "children",
        label: "Mes enfants",
        icon: <Users className="w-4 h-4" />,
      },
      {
        key: "notification",
        label: "Notifications",
        icon: <Bell className="w-4 h-4" />,
      },
      {
        key: "rib",
        label: "Coordonnées bancaires",
        icon: <CreditCard className="w-4 h-4" />,
      },
      {
        key: "documents",
        label: "Documents",
        icon: <FileText className="w-4 h-4" />,
      },
      {
        key: "settings",
        label: "Paramètres",
        icon: <Settings className="w-4 h-4" />,
      },
    ];
  }

  if (role === "DIRECTOR") {
    return [
      {
        key: "schoolYear",
        label: "Année scolaire",
        icon: <CalendarDays className="w-4 h-4" />,
      },
      {
        key: "classes",
        label: "Classes",
        icon: <LayoutGrid className="w-4 h-4" />,
      },
      {
        key: "subjects",
        label: "Matières",
        icon: <BookOpen className="w-4 h-4" />,
      },
      {
        key: "teachers",
        label: "Professeurs",
        icon: <UserRound className="w-4 h-4" />,
      },
      {
        key: "notification",
        label: "Notifications",
        icon: <Bell className="w-4 h-4" />,
      },
      { key: "eleves", label: "Éleves", icon: <Users className="w-4 h-4" /> },
      {
        key: "pendingStudents",
        label: "Élèves en attente",
        icon: <UserLock className="w-4 h-4" />,
      },
      {
        key: "documents",
        label: "Documents",
        icon: <FileText className="w-4 h-4" />,
      },
      {
        key: "charts",
        label: "Graphiques",
        icon: <ChartPie className="w-4 h-4" />,
      },
      {
        key: "settings",
        label: "Paramètres",
        icon: <Settings className="w-4 h-4" />,
      },
    ];
  }

  if (role === "TEACHER") {
    return [
      {
        key: "myProfile",
        label: "Mon Profil",
        icon: <User className="w-4 h-4" />,
      },
      {
        key: "infos",
        label: "Ma classe & matière",
        icon: <LayoutGrid className="w-4 h-4" />,
      },
      { key: "eleves", label: "Éleves", icon: <Users className="w-4 h-4" /> },
      {
        key: "notifications",
        label: "Notifications",
        icon: <Bell className="w-4 h-4" />,
      },
      {
        key: "settings",
        label: "Paramètres",
        icon: <Settings className="w-4 h-4" />,
      },
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
          <div className="flex flex-col gap-2 mt-4">
            {sections.map((section) => (
              <Button
                key={section.key}
                variant={activeSection === section.key ? "default" : "ghost"}
                onClick={() => setActiveSection(section.key)}
                className="flex items-center justify-start gap-2 w-full px-4 py-2 text-sm cursor-pointer"
              >
                {section.icon}
                <span>{section.label}</span>
              </Button>
            ))}
            <Button
              variant="outline"
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="mt-4 flex items-center justify-start gap-2 px-4 py-2 w-full cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Se déconnecter</span>
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
