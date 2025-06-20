"use client";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
// import { Button } from "@/components/ui/button";
import SidebarBtn from "./SidebarBtn";
import { DashboardSection } from "../types/types";
// import { getInitials } from "../utils/getInitials";
import {
  // LogOut,
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
} from "lucide-react";
// import { Greeting } from "./Greeting";
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
  const [hasUnreadNotifs, setHasUnreadNotifs] = useState<boolean | null>(null);

  useEffect(() => {
    const checkUnread = async () => {
      try {
        if (!session?.user?.id || role !== "PARENT") return;

        const res = await fetch("/api/notifications");
        if (!res.ok) return;

        const data: { notifications: ParentNotification[] } = await res.json();

        const hasUnread = data.notifications.some((notif) => {
          const readBy = notif.readBy || [];
          return !readBy.some((entry) => entry.parentId === session.user.id);
        });

        setHasUnreadNotifs(hasUnread);
      } catch (error) {
        console.error("Erreur lors du fetch des notifications :", error);
      }
    };

    checkUnread();
  }, [role, session?.user?.id]);

  return (
    <aside className="w-64 h-auto bg-[white] border-r p-4 space-y-4">
      {/* <div className="mb-8">
        <Greeting
          name={session?.user?.lastName || "Utilisateur"}
          civility={session?.user?.civility || "M."}
        />
      </div> */}

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
            label="Élèves en attente"
            section="pendingStudents"
            activeSection={activeSection}
            setActiveSection={setActiveSectionAction}
            icon={<UserLock className="w-4 h-4" />}
          />
          <SidebarBtn
            label="Documents"
            section="documents"
            activeSection={activeSection}
            setActiveSection={setActiveSectionAction}
            icon={<FileText className="w-4 h-4" />}
          />
          <SidebarBtn
            label="Graphiques"
            section="charts"
            activeSection={activeSection}
            setActiveSection={setActiveSectionAction}
            icon={<ChartPie className="w-4 h-4" />}
          />
          <SidebarBtn
            label="Paramètres"
            section="settings"
            activeSection={activeSection}
            setActiveSection={setActiveSectionAction}
            icon={<Settings className="w-4 h-4" />}
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
            label="Documents"
            section="documents"
            activeSection={activeSection}
            setActiveSection={setActiveSectionAction}
            icon={<FileText className="w-4 h-4" />}
          />
          <SidebarBtn
            label="Notifications"
            section="notification"
            activeSection={activeSection}
            setActiveSection={(section) => {
              setActiveSectionAction(section);
              setHasUnreadNotifs(false);
            }}
            hasNotification={hasUnreadNotifs ?? undefined}
            icon={<Bell className="w-4 h-4" />}
          />
          <SidebarBtn
            label="Coordonnées bancaires"
            section="rib"
            activeSection={activeSection}
            setActiveSection={setActiveSectionAction}
            icon={<CreditCard className="w-4 h-4" />}
          />
          <SidebarBtn
            label="Paramètres"
            section="settings"
            activeSection={activeSection}
            setActiveSection={setActiveSectionAction}
            icon={<Settings className="w-4 h-4" />}
          />
        </>
      )}
      {role === "TEACHER" && (
        <>
          <SidebarBtn
            label="Mon Profil"
            section="myProfile"
            activeSection={activeSection}
            setActiveSection={setActiveSectionAction}
            icon={<User className="w-4 h-4" />}
          />
          <SidebarBtn
            label="Notifications"
            section="notifications"
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
          <SidebarBtn
            label="Paramètres"
            section="settings"
            activeSection={activeSection}
            setActiveSection={setActiveSectionAction}
            icon={<Settings className="w-4 h-4" />}
          />
        </>
      )}
    </aside>
  );
}
