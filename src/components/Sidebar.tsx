"use client";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import SidebarBtn from "./SidebarBtn";
import { DashboardSection } from "../types/types";
import { LogOut } from "lucide-react";
import { Greeting } from "./Greeting";
import { ParentNotification } from "../types/notification";

export default function Sidebar({
  activeSection,
  setActiveSectionAction,
}: {
  activeSection: DashboardSection;
  setActiveSectionAction: Dispatch<SetStateAction<DashboardSection>>;
}) {
  const { data: session } = useSession();
  const role = session?.user?.role;
  const [hasUnreadNotifs, setHasUnreadNotifs] = useState(false);

  useEffect(() => {
    if (role === "PARENT" && session?.user?.id) {
      fetch("/api/notifications")
        .then((res) => res.json())
        .then((data: { notifications: ParentNotification[] }) => {
          const unread = data.notifications?.some(
            (n) => !n.readBy?.some((r) => r.parentId === session.user.id)
          );
          setHasUnreadNotifs(unread);
        });
    }
  }, [role, session?.user?.id]);

  return (
    <aside className="w-64 h-screen bg-gray-100 border-r p-4 space-y-4">
      <Greeting name={session?.user?.lastName || "Utilisateur"} />

      {role === "DIRECTOR" && (
        <>
          <SidebarBtn
            label="Année scolaire"
            section="schoolYear"
            activeSection={activeSection}
            setActiveSection={setActiveSectionAction}
          />
          <SidebarBtn
            label="Classes"
            section="classes"
            activeSection={activeSection}
            setActiveSection={setActiveSectionAction}
          />
          <SidebarBtn
            label="Matières"
            section="subjects"
            activeSection={activeSection}
            setActiveSection={setActiveSectionAction}
          />
          <SidebarBtn
            label="Professeurs"
            section="teachers"
            activeSection={activeSection}
            setActiveSection={setActiveSectionAction}
          />
          <SidebarBtn
            label="Notifications"
            section="notification"
            activeSection={activeSection}
            setActiveSection={setActiveSectionAction}
          />
        </>
      )}

      {role === "PARENT" && (
        <>
          <SidebarBtn
            label="Mes enfants"
            section="children"
            activeSection={activeSection}
            setActiveSection={setActiveSectionAction}
          />
          <SidebarBtn
            label="Notifications"
            section="notification"
            activeSection={activeSection}
            setActiveSection={(section) => {
              setActiveSectionAction(section);
              setHasUnreadNotifs(false);
            }}
            hasNotification={hasUnreadNotifs}
          />
          <SidebarBtn
            label="Coordonnées bancaires"
            section="rib"
            activeSection={activeSection}
            setActiveSection={setActiveSectionAction}
          />
        </>
      )}

      {role === "TEACHER" && (
        <SidebarBtn
          label="Ma classe"
          section="myClass"
          activeSection={activeSection}
          setActiveSection={setActiveSectionAction}
        />
      )}

      <div className="mt-5">
        <Button
          variant="outline"
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="cursor-pointer"
        >
          Se déconnecter <LogOut />
        </Button>
      </div>
    </aside>
  );
}
