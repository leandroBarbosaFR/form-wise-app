"use client";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState } from "react";
import { DashboardSection } from "../types/types";

import { useMediaQuery } from "../app/hooks/useMediaQuery";

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
import StudentListWithFilter from "./StudentListWithFilter";
import DashboardCharts from "./DashboardCharts";

export default function DirectorDashboardContent() {
  const { data: session, status } = useSession();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [activeSection, setActiveSection] =
    useState<DashboardSection>("schoolYear");

  if (status === "loading") return <p>Chargement...</p>;
  if (!session || session.user.role !== "DIRECTOR") redirect("/login");

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
        {activeSection === "eleves" && (
          <>
            <StudentListWithFilter />
          </>
        )}
        {activeSection === "charts" && (
          <>
            <DashboardCharts />
          </>
        )}
      </main>
    </div>
  );
}
