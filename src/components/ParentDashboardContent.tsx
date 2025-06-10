"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState } from "react";
import Sidebar from "./Sidebar";
import MobileSidebar from "./MobileSidebar";
import StudentForm from "./StudentForm";
import ParentNotificationList from "./ParentNotificationList";
import { DashboardSection } from "../types/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Landmark } from "lucide-react";
import RIBForm from "./RIBForm";

type Student = {
  id: string;
  firstName: string;
  lastName: string;
};

export default function ParentDashboardContent() {
  const { data: session, status } = useSession();
  const [bankInfoMissing] = useState(false);

  const [activeSection, setActiveSection] =
    useState<DashboardSection>("children");

  if (status === "loading") return <p>Chargement...</p>;
  if (!session || session.user.role !== "PARENT") redirect("/login");
  console.log("activeSection:", activeSection);

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
      {bankInfoMissing && (
        <div className="w-full p-6">
          <Alert variant="destructive">
            <Landmark className="h-5 w-5" />
            <AlertTitle>Informations bancaires manquantes</AlertTitle>
            <AlertDescription>
              Veuillez renseigner votre IBAN, BIC et nom de banque pour que
              l’école puisse effectuer le prélèvement mensuel.
            </AlertDescription>
          </Alert>
        </div>
      )}

      <main className="flex-1 p-6 mt-10 md:mt-0">
        <h1 className="text-2xl font-bold mb-4">Espace Parent</h1>
        <p className="mb-6">Bienvenue,{session.user.firstName}</p>

        {activeSection === "children" && (
          <>
            <StudentForm
              onStudentAdded={(student: Student) => {
                console.log("Nouveau student :", student);
              }}
            />
          </>
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
      </main>
    </div>
  );
}
