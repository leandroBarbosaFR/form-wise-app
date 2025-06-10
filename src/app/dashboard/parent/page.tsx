"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState, useEffect } from "react";
import { DashboardSection } from "../../../../src/types/types";
import Sidebar from "../../../components/Sidebar";
import MobileSidebar from "../../../components/MobileSidebar";
import ParentNotificationList from "../../../components/ParentNotificationList";
import StudentForm from "../../../components/StudentForm";
import StudentList from "../../../components/StudentList";

type Student = {
  id: string;
  firstName: string;
  lastName: string;
};

export default function ParentDashboardPage() {
  const { data: session, status } = useSession();
  const [activeSection, setActiveSection] =
    useState<DashboardSection>("children");
  const [students, setStudents] = useState<Student[]>([]);

  const fetchStudents = async () => {
    const res = await fetch("/api/students");
    const data = await res.json();
    setStudents(data.students || []);
  };

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "PARENT") {
      fetchStudents();
    }
  }, [status, session]);

  const handleStudentAdded = (newStudent: Student) => {
    setStudents((prev) => [...prev, newStudent]);
  };

  if (status === "loading") return <p>Chargement...</p>;
  if (!session || session.user.role !== "PARENT") {
    redirect("/login");
    return null; // sécurité (ne jamais retourner rien sans JSX)
  }

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
        <h1 className="text-2xl font-bold mb-4">Tableau de bord parent</h1>
        <p className="mb-6">Bienvenue, {session.user.firstName}</p>

        {activeSection === "children" && (
          <>
            <StudentForm onStudentAdded={handleStudentAdded} />
            <StudentList students={students} setStudents={setStudents} />
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
