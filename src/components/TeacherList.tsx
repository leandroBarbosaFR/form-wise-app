"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import TeacherForm from "./TeacherForm"; // Ajuste le chemin si besoin

export type Teacher = {
  id: string;
  firstName: string;
  lastName: string;
  subject: {
    id: string;
    name: string;
  };
  class: {
    id: string;
    name: string;
  };
};

export default function TeacherList() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const res = await fetch("/api/teachers", {
          credentials: "include",
        });
        const data = await res.json();
        setTeachers(data.teachers || []);
      } catch (error) {
        console.error("Erreur chargement enseignants:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/teachers/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setTeachers((prev) => prev.filter((t) => t.id !== id));
      }
    } catch (error) {
      console.error("Erreur suppression professeur:", error);
    }
  };

  const handleEdit = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
  };

  if (loading) return <p>Chargement des professeurs...</p>;

  return (
    <div className="mt-6">
      <TeacherForm
        onCreated={() => location.reload()}
        teacher={selectedTeacher}
      />

      {teachers.length === 0 ? (
        <p className="text-muted-foreground mt-6">
          Aucun professeur enregistré pour l&apos;instant.
        </p>
      ) : (
        <div className="grid gap-4 mt-6">
          {teachers.map((teacher) => (
            <Card key={teacher.id}>
              <CardContent className="p-4">
                <p className="font-semibold">
                  {teacher.firstName} {teacher.lastName}
                </p>
                <p className="text-sm text-muted-foreground">
                  Matière : {teacher.subject.name} <br />
                  Classe : {teacher.class.name}
                </p>
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleEdit(teacher)}
                  >
                    Modifier ✏️
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(teacher.id)}
                  >
                    Supprimer 🗑
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
