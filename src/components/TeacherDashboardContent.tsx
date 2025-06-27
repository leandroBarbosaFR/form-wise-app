"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState, useEffect } from "react";
import { useMediaQuery } from "../app/hooks/useMediaQuery";
import CenteredSpinner from "./CenteredSpinner";
import Sidebar from "./Sidebar";
import MobileSidebar from "./MobileSidebar";
import { DashboardSection } from "../types/types";
import StudentListTeacher from "./StudentListTeacher";
import TeacherNotificationList from "./TeacherNotificationList";
import TeacherProfile from "./TeacherProfile";
import type { TeacherData } from "../types/teacher";
import AccountSettings from "./AccountSettings";

export default function TeacherDashboardContent() {
  const { data: session, status } = useSession();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [activeSection, setActiveSection] =
    useState<DashboardSection>("myProfile");
  const [teacher, setTeacher] = useState<TeacherData | null>(null);
  const [loadingTeacher, setLoadingTeacher] = useState(true);

  // 🔄 Récupérer section active depuis localStorage
  useEffect(() => {
    const savedSection = localStorage.getItem("teacherActiveSection");
    if (savedSection) {
      setActiveSection(savedSection as DashboardSection);
    }
  }, []);

  // 💾 Sauvegarder section active à chaque changement
  useEffect(() => {
    localStorage.setItem("teacherActiveSection", activeSection);
  }, [activeSection]);

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const res = await fetch("/api/teachers/me");
        const data = await res.json();
        setTeacher(data.teacher);
      } catch (err) {
        console.error("Erreur récupération teacher:", err);
      } finally {
        setLoadingTeacher(false);
      }
    };

    fetchTeacher();
  }, []);

  if (status === "loading") return <CenteredSpinner label="Chargement..." />;
  if (!session || session.user.role !== "TEACHER") redirect("/login");

  return (
    <div className="flex min-h-screen">
      {isMobile ? (
        <MobileSidebar
          activeSection={activeSection}
          setActiveSectionAction={setActiveSection}
        />
      ) : (
        <Sidebar
          activeSection={activeSection}
          setActiveSectionAction={setActiveSection}
        />
      )}

      <main className="flex-1 p-6 mt-10 md:mt-0">
        <p className="mb-6">Bienvenue, professeur {teacher?.user?.firstName}</p>

        {activeSection === "myProfile" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Mon Profil</h2>
            {loadingTeacher ? (
              <CenteredSpinner label="Chargement des infos..." />
            ) : teacher ? (
              <TeacherProfile teacher={teacher} />
            ) : (
              <p className="text-muted-foreground">
                Aucune donnée professeur trouvée.
              </p>
            )}
          </div>
        )}

        {activeSection === "eleves" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">
              Élèves de votre classe
            </h2>
            <StudentListTeacher />
          </div>
        )}

        {activeSection === "notifications" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Notifications reçues</h2>
            <TeacherNotificationList />
          </div>
        )}
        {activeSection === "settings" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Paramètres du compte</h2>
            <AccountSettings />
          </div>
        )}
      </main>
    </div>
  );
}
