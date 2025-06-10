"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserX } from "lucide-react";

type Student = {
  id: string;
  firstName: string;
  lastName: string;
};

type StudentListProps = {
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
};

export default function StudentList({
  students,
  setStudents,
}: StudentListProps) {
  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/students/${id}`, { method: "DELETE" });
    const data = await res.json();

    if (data.success) {
      setStudents((prev) => prev.filter((s) => s.id !== id));
    }
  };

  if (students.length === 0) {
    return (
      <p className="text-muted-foreground">
        Aucun élève inscrit pour le moment.
      </p>
    );
  }

  return (
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
              Supprimer <UserX className="ml-2 w-4 h-4" />
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
