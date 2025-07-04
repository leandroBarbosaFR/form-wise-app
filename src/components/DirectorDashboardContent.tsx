"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState, useEffect } from "react";
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
import CenteredSpinner from "./CenteredSpinner";
import PendingStudents from "./PendingStudents";
import DirectorDocumentList from "./DirectorDocumentList";
import AccountSettings from "./AccountSettings";
import InviteParentsPage from "../app/dashboard/director/invite-parents/page";
import { InvitedParentList } from "./InvitedParentList";
import StaffForm from "./StaffForm";
import InvitedStaffList from "./InvitedStaffList";
import PendingPreinscriptionsTable from "./PendingPreinscriptionsTable";

export type InvitedStaff = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  roleLabel: string;
  createdAt: string;
  accepted: boolean;
};

export default function DirectorDashboardContent() {
  const { data: session, status } = useSession();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [activeSection, setActiveSection] =
    useState<DashboardSection>("schoolYear");
  const [invitedStaffList, setInvitedStaffList] = useState<InvitedStaff[]>([]);

  // Récupérer les staff invités
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res = await fetch("/api/invited-staff");
        const data = await res.json();
        setInvitedStaffList(data.staff || []);
      } catch (error) {
        console.error("Erreur lors du chargement du staff invité :", error);
      }
    };

    if (activeSection === "inviteStaff") {
      fetchStaff();
    }
  }, [activeSection]);

  // Charger depuis localStorage
  useEffect(() => {
    const savedSection = localStorage.getItem("directorActiveSection");
    if (savedSection) {
      setActiveSection(savedSection as DashboardSection);
    }
  }, []);

  // Sauvegarder dans localStorage à chaque changement
  useEffect(() => {
    localStorage.setItem("directorActiveSection", activeSection);
  }, [activeSection]);

  if (status === "loading") return <CenteredSpinner label="Chargement..." />;
  if (!session || session.user.role !== "DIRECTOR") redirect("/login");

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
        <p className="mb-6">
          Bienvenue, {session.user.firstName} {session.user.lastName}
        </p>

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
          <div className="flex flex-col gap-4">
            <SubjectForm />
            <SubjectList />
          </div>
        )}

        {activeSection === "teachers" && <TeacherList />}

        {activeSection === "notification" && (
          <>
            <NotificationForm onSent={() => location.reload()} />
            <DirectorNotificationList />
          </>
        )}

        {activeSection === "eleves" && <StudentListWithFilter />}
        {activeSection === "documents" && <DirectorDocumentList />}
        {activeSection === "pendingStudents" && <PendingStudents />}
        {activeSection === "charts" && <DashboardCharts />}

        {activeSection === "inviteParent" && (
          <>
            <InviteParentsPage />
            <InvitedParentList />
          </>
        )}

        {activeSection === "pendingPreinscriptions" && (
          <>
            <PendingPreinscriptionsTable />
          </>
        )}

        {activeSection === "inviteStaff" && (
          <>
            <StaffForm />
            <InvitedStaffList
              staffList={invitedStaffList}
              setStaffListAction={setInvitedStaffList}
            />
          </>
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
