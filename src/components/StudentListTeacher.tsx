"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";

type Student = {
  id: string;
  firstName: string;
  lastName: string;
  healthIssues: string | null;
  canLeaveAlone: boolean;
  parent: {
    firstName: string;
    lastName: string;
  };
};

export default function StudentListTeacher() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const handleView = (student: Student) => {
    setSelectedStudent(student);
    setDialogOpen(true);
  };

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch("/api/teachers/students");
        const data = await res.json();
        setStudents(data || []);
      } catch (err) {
        console.error("Erreur récupération élèves:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded-md" />
        ))}
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <p className="text-muted-foreground">
        Aucun élève assigné à votre classe.
      </p>
    );
  }

  return (
    <>
      <div className="overflow-x-auto rounded-md border shadow-sm mt-6">
        <table className="min-w-full text-sm">
          <thead className="bg-muted text-muted-foreground uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">Élève</th>
              <th className="px-4 py-3 text-left">Parent</th>
              <th className="px-4 py-3 text-left">Problèmes de santé</th>
              <th className="px-4 py-3 text-left">Peut partir seul</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {students.map((student) => (
              <tr key={student.id}>
                <td className="px-4 py-2 font-medium">
                  {student.firstName} {student.lastName}
                </td>
                <td className="px-4 py-2">
                  {student.parent.firstName} {student.parent.lastName}
                </td>
                <td className="px-4 py-2">{student.healthIssues || "Aucun"}</td>
                <td className="px-4 py-2">
                  {student.canLeaveAlone ? "Oui" : "Non"}
                </td>
                <td className="px-4 py-2 text-right">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleView(student)}
                    className="cursor-pointer"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogDescription>Fiche de l&apos;élève</DialogDescription>
            <DialogTitle>
              {selectedStudent?.firstName} {selectedStudent?.lastName}
            </DialogTitle>
          </DialogHeader>

          {selectedStudent && (
            <Card className="mt-4">
              <CardContent className="space-y-3 pt-4 text-sm">
                <p>
                  <strong>Parent :</strong> {selectedStudent.parent.firstName}{" "}
                  {selectedStudent.parent.lastName}
                </p>
                <p>
                  <strong>Problèmes de santé :</strong>{" "}
                  {selectedStudent.healthIssues || "Aucun"}
                </p>
                <p>
                  <strong>Peut partir seul :</strong>{" "}
                  {selectedStudent.canLeaveAlone ? "Oui" : "Non"}
                </p>
              </CardContent>
            </Card>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
