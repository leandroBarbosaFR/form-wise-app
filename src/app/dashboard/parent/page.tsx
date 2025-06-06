"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import StudentForm from "../../../../src/components/StudentForm";
import { signOut } from "next-auth/react";

type Student = {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
};

export default function ParentDashboard() {
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch("/api/students", {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error(`Erreur HTTP: ${res.status}`);
        }

        const data = await res.json();

        if (Array.isArray(data.students)) {
          setStudents(data.students);
        } else {
          console.warn("Pas de liste d'élèves dans la réponse :", data);
          setStudents([]);
        }
      } catch (error) {
        console.error("Erreur de chargement des élèves", error);
        setStudents([]);
      }
    };

    fetchStudents();
  }, []);

  const handleAddStudent = (studentData: Student) => {
    setStudents((prev) => [...prev, studentData]);
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/students/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) {
      setStudents((prev) => prev.filter((s) => s.id !== id));
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">👨‍👩‍👧‍👦 Mes enfants</h1>

      <StudentForm onStudentAdded={handleAddStudent} />

      {Array.isArray(students) && students.length === 0 ? (
        <p className="text-muted-foreground">
          Aucun élève inscrit pour le moment.
        </p>
      ) : (
        <div className="grid gap-4">
          {students.map((student) => (
            <Card key={student.id}>
              <CardContent className="p-4 flex justify-between items-center">
                <span>
                  {student.firstName} {student.lastName}
                </span>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(student.id)}
                >
                  Supprimer
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <div className="mt-5">
        <Button
          variant="outline"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          Se déconnecter
        </Button>
      </div>
    </div>
  );
}
