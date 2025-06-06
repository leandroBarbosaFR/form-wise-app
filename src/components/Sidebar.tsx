"use client";
import { Dispatch, SetStateAction } from "react";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import SidebarBtn from "./SidebarBtn";
import { DashboardSection } from "../types/types";

export default function Sidebar({
  activeSection,
  setActiveSectionAction,
}: {
  activeSection: DashboardSection;
  setActiveSectionAction: Dispatch<SetStateAction<DashboardSection>>;
}) {
  const { data: session } = useSession();
  const role = session?.user?.role;

  return (
    <aside className="w-64 h-screen bg-gray-100 border-r p-4 space-y-4">
      <h2 className="text-lg font-semibold">📂 Navigation</h2>

      {role === "DIRECTOR" && (
        <>
          <SidebarBtn
            label="📅 Année scolaire"
            section="schoolYear"
            activeSection={activeSection}
            setActiveSection={setActiveSectionAction}
          />
          <SidebarBtn
            label="🎓 Classes"
            section="classes"
            activeSection={activeSection}
            setActiveSection={setActiveSectionAction}
          />
          <SidebarBtn
            label="📚 Matières"
            section="subjects"
            activeSection={activeSection}
            setActiveSection={setActiveSectionAction}
          />
          <SidebarBtn
            label="👩‍🏫 Professeurs"
            section="teachers"
            activeSection={activeSection}
            setActiveSection={setActiveSectionAction}
          />
        </>
      )}

      {role === "PARENT" && (
        <SidebarBtn
          label="👶 Mes enfants"
          section="children"
          activeSection={activeSection}
          setActiveSection={setActiveSectionAction}
        />
      )}

      {role === "TEACHER" && (
        <SidebarBtn
          label="📋 Ma classe"
          section="myClass"
          activeSection={activeSection}
          setActiveSection={setActiveSectionAction}
        />
      )}

      <div className="mt-5">
        <Button
          variant="outline"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          Se déconnecter
        </Button>
      </div>
    </aside>
  );
}
