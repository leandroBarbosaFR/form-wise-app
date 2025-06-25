"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UserX } from "lucide-react";
import EmptyState from "./EmptyState";

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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/students/${id}`, { method: "DELETE" });
    const data = await res.json();

    if (data.success) {
      setStudents((prev) => prev.filter((s) => s.id !== id));
    }
  };

  if (students.length === 0) {
    return (
      <EmptyState
        message="Aucun élève inscrit pour le moment."
        actionLabel="Ajouter un élève"
        onAction={() => {
          console.log("Ajouter un élève");
        }}
      />
    );
  }

  if (isMobile) {
    // Cartes sur mobile
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
                className="cursor-pointer"
              >
                Supprimer <UserX className="ml-2 w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Tableau sur desktop
  return (
    <div className="overflow-x-auto rounded-md border shadow-sm">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 dark:bg-zinc-800">
          <tr className="text-left text-gray-500 dark:text-gray-300 uppercase text-xs">
            <th className="px-4 py-3">Prénom</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-zinc-700">
          {students.map((student) => (
            <tr
              key={student.id}
              className="hover:bg-gray-50 dark:hover:bg-zinc-700"
            >
              <td className="px-4 py-3 font-medium text-black dark:text-white">
                {student.firstName} {student.lastName}
              </td>
              <td className="px-4 py-3 text-right space-x-2">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(student.id)}
                  className="cursor-pointer"
                >
                  Supprimer <UserX className="ml-2 w-4 h-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
