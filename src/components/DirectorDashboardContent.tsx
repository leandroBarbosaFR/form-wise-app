"use client";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState } from "react";
import { DashboardSection } from "../types/types";

import Sidebar from "./Sidebar";
import MobileSidebar from "./MobileSidebar";
import SchoolYearForm from "./SchoolYearForm";
import SchoolYearList from "./SchoolYearList";
import ClassForm from "./ClassForm";
import ClassList from "./ClassList";
import SubjectForm from "./SubjectForm";
import SubjectList from "./SubjectList";
import TeacherList from "./TeacherList";
import NotificationForm from "./NotificationForm";
import DirectorNotificationList from "./DirectorNotificationList";

export default function DirectorDashboardContent() {
  const { data: session, status } = useSession();
  const [activeSection, setActiveSection] =
    useState<DashboardSection>("schoolYear");

  if (status === "loading") return <p>Chargement...</p>;
  if (!session || session.user.role !== "DIRECTOR") redirect("/login");

  return (
    <div className="flex min-h-screen">
      <Sidebar
        activeSection={activeSection}
        setActiveSectionAction={setActiveSection}
      />
      <MobileSidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      <main className="flex-1 p-6 mt-10 md:mt-0">
        {/* <h1 className="text-2xl font-bold mb-4">
          Tableau de bord du directeur
        </h1> */}
        <p className="mb-6">Bienvenue, {session.user.role}</p>

        {activeSection === "schoolYear" && (
          <>
            <SchoolYearForm onCreated={() => location.reload()} />
            <SchoolYearList />
          </>
        )}

        {activeSection === "classes" && (
          <>
            <ClassForm onCreated={() => location.reload()} />
            <ClassList />
          </>
        )}

        {activeSection === "subjects" && (
          <>
            <div className="flex flex-col gap-4">
              <SubjectForm />
              <SubjectList />
            </div>
          </>
        )}

        {activeSection === "teachers" && (
          <>
            <TeacherList />
          </>
        )}

        {activeSection === "notification" && (
          <>
            <NotificationForm onSent={() => location.reload()} />
            <DirectorNotificationList />
          </>
        )}
      </main>
    </div>
  );
}
