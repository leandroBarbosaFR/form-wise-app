"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState, useEffect } from "react";
import { DashboardSection } from "../types/types";
import Sidebar from "../components/Sidebar";
import MobileSidebar from "../components/MobileSidebar";
import ParentNotificationList from "../components/ParentNotificationList";
import StudentForm from "../components/StudentForm";
import StudentList from "../components/StudentList";
import RIBForm from "components/RIBForm";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { useMediaQuery } from "../app/hooks/useMediaQuery";
import CenteredSpinner from "./CenteredSpinner";
import DocumentManager from "./DocumentManager";
import ParentDocumentList from "./ParentDocumentList";
import AccountSettings from "./AccountSettings";
export const dynamic = "force-dynamic";

type Student = {
  id: string;
  firstName: string;
  lastName: string;
};

export default function ParentDashboardContent() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [showList, setShowList] = useState(false);

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
    const storedSection = localStorage.getItem("activeSection");
    if (storedSection) {
      setActiveSection(storedSection as DashboardSection);
    }
  }, []);

  // Sauvegarde la section à chaque changement
  useEffect(() => {
    localStorage.setItem("activeSection", activeSection);
  }, [activeSection]);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "PARENT") {
      fetchStudents();
    }
  }, [status, session]);

  const handleStudentAdded = (newStudent: Student) => {
    setStudents((prev) => [...prev, newStudent]);
  };

  if (status === "loading") return <CenteredSpinner label="Chargement..." />;
  if (!session || session.user.role !== "PARENT") {
    redirect("/login");
    return null;
  }

  const fullName = `${session.user.firstName} ${session.user.lastName}`;

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
        {/* <h1 className="text-2xl font-bold mb-4">Tableau de bord parent</h1> */}
        <p className="mb-6">Bienvenue, {fullName}</p>

        {activeSection === "children" && (
          <div className="flex flex-col gap-4">
            <StudentForm onStudentAdded={handleStudentAdded} />

            <div>
              {!students.length ? null : (
                <>
                  {showList ? (
                    <>
                      <StudentList
                        students={students}
                        setStudents={setStudents}
                      />
                      <Button
                        className="mt-2 cursor-pointer"
                        onClick={() => setShowList(false)}
                      >
                        Masquer la liste <Minus />
                      </Button>
                    </>
                  ) : (
                    <Button
                      className="mt-4 cursor-pointer"
                      onClick={() => setShowList(true)}
                    >
                      Voir la liste des élèves <Plus />
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {activeSection === "notification" && (
          <>
            <ParentNotificationList />
          </>
        )}
        {activeSection === "rib" && (
          <>
            <h2 className="text-xl font-semibold mb-4">
              Coordonnées bancaires
            </h2>
            <RIBForm />
          </>
        )}
        {activeSection === "documents" && (
          <>
            <DocumentManager />
            <ParentDocumentList />
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
