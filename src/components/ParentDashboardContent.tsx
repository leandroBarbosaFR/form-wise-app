"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState } from "react";
import Sidebar from "./Sidebar";
import MobileSidebar from "./MobileSidebar";
// import StudentList from "./StudentList";
import StudentForm from "./StudentForm";
import ParentNotificationList from "./ParentNotificationList";
import { DashboardSection } from "../types/types";

export default function ParentDashboardContent() {
  const { data: session, status } = useSession();

  const [activeSection, setActiveSection] =
    useState<DashboardSection>("children");

  if (status === "loading") return <p>Chargement...</p>;
  if (!session || session.user.role !== "PARENT") redirect("/login");
  console.log(session);
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
        <h1 className="text-2xl font-bold mb-4">Espace Parent</h1>
        <p className="mb-6">Bienvenue, {session.user.firstName}</p>

        {activeSection === "children" && (
          <>
            <StudentForm
              onStudentAdded={function (student: any): void {
                throw new Error("Function not implemented.");
              }}
            />
            {/* <StudentList /> */}
          </>
        )}

        {activeSection === "notification" && (
          <>
            <ParentNotificationList />
          </>
        )}
      </main>
    </div>
  );
}
