"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState, useEffect } from "react";
import { useMediaQuery } from "../app/hooks/useMediaQuery";
import CenteredSpinner from "./CenteredSpinner";
import Sidebar from "./Sidebar";
import MobileSidebar from "./MobileSidebar";
import { DashboardSection } from "../types/types";

type TeacherData = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  class?: {
    id: string;
    name: string;
  } | null;
  subject?: {
    id: string;
    name: string;
  } | null;
};

export default function TeacherDashboardContent() {
  const { data: session, status } = useSession();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [activeSection, setActiveSection] = useState<DashboardSection>("infos");
  const [teacher, setTeacher] = useState<TeacherData | null>(null);
  const [loadingTeacher, setLoadingTeacher] = useState(true);

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
          setActiveSection={setActiveSection}
        />
      ) : (
        <Sidebar
          activeSection={activeSection}
          setActiveSectionAction={setActiveSection}
        />
      )}

      <main className="flex-1 p-6 mt-10 md:mt-0">
        <p className="mb-6">Bienvenue, professeur {session.user.firstName}</p>

        {activeSection === "infos" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">
              Votre classe & matière
            </h2>

            {loadingTeacher ? (
              <p>Chargement...</p>
            ) : teacher ? (
              <>
                <p>
                  Classe assignée :{" "}
                  <span className="font-medium">
                    {teacher.class?.name || "—"}
                  </span>
                </p>
                <p>
                  Matière :{" "}
                  <span className="font-medium">
                    {teacher.subject?.name || "—"}
                  </span>
                </p>
              </>
            ) : (
              <p>Aucune donnée trouvée pour ce professeur.</p>
            )}
          </div>
        )}

        {activeSection === "eleves" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">
              Élèves de votre classe
            </h2>
            {/* TODO: List students from assigned class */}
            <p>
              À implémenter : Liste des élèves liés à la classe du professeur
            </p>
          </div>
        )}

        {activeSection === "notifications" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">
              Envoyer une notification
            </h2>
            {/* TODO: Notification form to parents */}
            <p>
              À implémenter : Formulaire d&apos;envoi de notification aux
              parents
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
