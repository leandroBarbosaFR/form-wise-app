"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import TeacherForm from "./TeacherForm";
import { UserPen, UserPlus, UserX } from "lucide-react";
// import { UserX } from "lucide-react";
// import { UserPlus } from "lucide-react";

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
  const [showForm, setShowForm] = useState(false);
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
    setShowForm(true);
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
    setShowForm(false);
  };

  if (loading) return <p>Chargement des professeurs...</p>;

  return (
    <div className="mt-6">
      {!showForm && (
        <Button
          onClick={() => {
            setSelectedTeacher(null);
            setShowForm(true);
          }}
        >
          Ajouter un professeur <UserPlus />
        </Button>
      )}

      {showForm && (
        <div className="my-6 p-4 border rounded bg-muted">
          <TeacherForm
            onCreated={handleCreatedOrUpdated}
            teacher={selectedTeacher}
          />
          <div className="mt-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowForm(false);
                setSelectedTeacher(null);
              }}
            >
              Annuler
            </Button>
          </div>
        </div>
      )}

      <div className="grid gap-4 mt-6">
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
                  Modifier <UserPen />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(teacher.id)}
                >
                  Supprimer <UserX />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
