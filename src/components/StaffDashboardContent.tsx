"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState, useEffect } from "react";
import { DashboardSection } from "../types/types";
import { useMediaQuery } from "../app/hooks/useMediaQuery";

import Sidebar from "./Sidebar";
import MobileSidebar from "./MobileSidebar";
import DirectorNotificationList from "./DirectorNotificationList";
import StudentListWithFilter from "./StudentListWithFilter";
import DirectorDocumentList from "./DirectorDocumentList";
import CenteredSpinner from "./CenteredSpinner";
import AccountSettings from "./AccountSettings";

export default function StaffDashboardContent() {
  const { data: session, status } = useSession();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [activeSection, setActiveSection] =
    useState<DashboardSection>("eleves");

  // Charger section sauvegardée
  useEffect(() => {
    const savedSection = localStorage.getItem("staffActiveSection");
    if (savedSection) {
      setActiveSection(savedSection as DashboardSection);
    }
  }, []);

  // Sauvegarder la section active
  useEffect(() => {
    localStorage.setItem("staffActiveSection", activeSection);
  }, [activeSection]);

  if (status === "loading") return <CenteredSpinner label="Chargement..." />;
  if (!session || session.user.role !== "STAFF") redirect("/login");

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
        <p className="mb-6">
          Bienvenue, {session.user.firstName} {session.user.lastName}
        </p>

        {activeSection === "notification" && <DirectorNotificationList />}

        {activeSection === "eleves" && <StudentListWithFilter />}

        {activeSection === "documents" && <DirectorDocumentList />}

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
