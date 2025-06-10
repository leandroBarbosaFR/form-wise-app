"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import TeacherForm from "./TeacherForm";
import { UserPen, UserX } from "lucide-react";

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

export default function TeacherList({
  visible = false,
}: {
  visible?: boolean;
}) {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [showList, setShowList] = useState(visible);

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

  const handleCreatedOrUpdated = (updatedTeacher: Teacher) => {
    setTeachers((prev) => {
      const exists = prev.find((t) => t.id === updatedTeacher.id);
      if (exists) {
        return prev.map((t) =>
          t.id === updatedTeacher.id ? updatedTeacher : t
        );
      } else {
        return [...prev, updatedTeacher];
      }
    });
    setSelectedTeacher(null);
  };

  if (loading) return <p>Chargement des professeurs...</p>;

  return (
    <div className="mt-6 flex flex-col gap-6">
      {/* Toujours visible */}
      <TeacherForm
        onCreated={handleCreatedOrUpdated}
        teacher={selectedTeacher}
      />

      {/* Bouton toggle */}
      <Button onClick={() => setShowList(!showList)} variant="outline">
        {showList
          ? "Masquer la liste des professeurs"
          : "Voir tous les professeurs"}
      </Button>

      {/* Liste des profs */}
      {showList && (
        <div className="grid gap-4">
          {teachers.map((teacher) => (
            <Card key={teacher.id}>
              <CardContent className="p-4 flex justify-between">
                <div>
                  <p className="font-semibold">
                    {teacher.firstName} {teacher.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Matière : {teacher.subject.name} <br />
                    Classe : {teacher.class.name}
                  </p>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleEdit(teacher)}
                  >
                    Modifier <UserPen className="ml-1 h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(teacher.id)}
                  >
                    Supprimer <UserX className="ml-1 h-4 w-4" />
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
