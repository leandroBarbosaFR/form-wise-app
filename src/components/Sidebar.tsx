"use client";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import SidebarBtn from "./SidebarBtn";
import { DashboardSection } from "../types/types";
import {
  LogOut,
  CalendarDays,
  LayoutGrid,
  BookOpen,
  UserRound,
  Bell,
  Users,
  CreditCard,
  ChartPie,
} from "lucide-react";
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
            icon={<CalendarDays className="w-4 h-4" />}
          />
          <SidebarBtn
            label="Classes"
            section="classes"
            activeSection={activeSection}
            setActiveSection={setActiveSectionAction}
            icon={<LayoutGrid className="w-4 h-4" />}
          />
          <SidebarBtn
            label="Matières"
            section="subjects"
            activeSection={activeSection}
            setActiveSection={setActiveSectionAction}
            icon={<BookOpen className="w-4 h-4" />}
          />
          <SidebarBtn
            label="Professeurs"
            section="teachers"
            activeSection={activeSection}
            setActiveSection={setActiveSectionAction}
            icon={<UserRound className="w-4 h-4" />}
          />
          <SidebarBtn
            label="Notifications"
            section="notification"
            activeSection={activeSection}
            setActiveSection={setActiveSectionAction}
            icon={<Bell className="w-4 h-4" />}
          />
          <SidebarBtn
            label="Éleves"
            section="eleves"
            activeSection={activeSection}
            setActiveSection={setActiveSectionAction}
            icon={<Users className="w-4 h-4" />}
          />
          <SidebarBtn
            label="Graphiques"
            section="charts"
            activeSection={activeSection}
            setActiveSection={setActiveSectionAction}
            icon={<ChartPie className="w-4 h-4" />}
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
            icon={<Users className="w-4 h-4" />}
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
            icon={<Bell className="w-4 h-4" />}
          />
          <SidebarBtn
            label="Coordonnées bancaires"
            section="rib"
            activeSection={activeSection}
            setActiveSection={setActiveSectionAction}
            icon={<CreditCard className="w-4 h-4" />}
          />
        </>
      )}

      {role === "TEACHER" && (
        <>
          <SidebarBtn
            label="Ma classe"
            section="myClass"
            activeSection={activeSection}
            setActiveSection={setActiveSectionAction}
            icon={<LayoutGrid className="w-4 h-4" />}
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
            icon={<Bell className="w-4 h-4" />}
          />
          <SidebarBtn
            label="Éleves"
            section="eleves"
            activeSection={activeSection}
            setActiveSection={setActiveSectionAction}
            icon={<Users className="w-4 h-4" />}
          />
        </>
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
