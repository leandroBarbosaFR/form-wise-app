"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import CenteredSpinner from "./CenteredSpinner";

type Student = {
  id: string;
  firstName: string;
  lastName: string;
  parent: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
};

export default function TeacherStudentList() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/teachers/students")
      .then((res) => res.json())
      .then((data) => {
        setStudents(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <CenteredSpinner label="Chargement..." />;

  return (
    <div className="mt-6 space-y-4">
      {students.map((student) => (
        <Card key={student.id}>
          <CardContent className="p-4">
            <p className="font-semibold">
              {student.firstName} {student.lastName}
            </p>
            <p className="text-sm text-muted-foreground">
              Parent : {student.parent.firstName} {student.parent.lastName}
            </p>
            <p className="text-sm text-muted-foreground">
              Email : {student.parent.email}
            </p>
            <p className="text-sm text-muted-foreground">
              Téléphone : {student.parent.phone}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
