"use client";

import { useEffect, useState } from "react";
// import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SchoolClass {
  id: string;
  name: string;
}

interface Subject {
  id: string;
  name: string;
  class: {
    id: string;
    name: string;
  };
  teachers: {
    user: {
      firstName: string;
      lastName: string;
    };
  }[];
}

export default function SubjectList() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>("");

  useEffect(() => {
    const fetchClasses = async () => {
      const res = await fetch("/api/classes", { credentials: "include" });
      const data = await res.json();
      setClasses(data.classes || []);
    };

    const fetchSubjects = async () => {
      const res = await fetch("/api/subjects");
      const data = await res.json();
      setSubjects(data.subjects || []);
    };

    fetchClasses();
    fetchSubjects();
  }, []);

  const filteredSubjects = subjects.filter(
    (s) => s.class.id === selectedClassId
  );

  return (
    <div className="space-y-6 mt-6">
      <div className="space-y-2">
        <Label
          htmlFor="class-select"
          className="text-sm font-medium text-muted-foreground"
        >
          Choisir une classe
        </Label>
        <Select onValueChange={setSelectedClassId}>
          <SelectTrigger id="class-select" className="w-48">
            <SelectValue placeholder="Sélectionner une classe" />
          </SelectTrigger>
          <SelectContent>
            {classes.map((cls) => (
              <SelectItem key={cls.id} value={cls.id}>
                {cls.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedClassId && (
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-muted-foreground">
            Matières de la classe{" "}
            {classes.find((c) => c.id === selectedClassId)?.name}
          </h2>

          {filteredSubjects.length === 0 ? (
            <p className="text-muted-foreground">
              Aucune matière pour cette classe.
            </p>
          ) : (
            <div className="overflow-x-auto rounded-md border shadow-sm">
              <table className="min-w-full text-sm">
                <thead className="bg-muted text-muted-foreground uppercase text-xs">
                  <tr>
                    <th className="px-4 py-3 text-left">Matière</th>
                    <th className="px-4 py-3 text-left">Professeur</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredSubjects.map((subject) => (
                    <tr key={subject.id} className="hover:bg-muted/20">
                      <td className="px-4 py-2 font-medium">{subject.name}</td>
                      <td className="px-4 py-2">
                        {subject.teachers.length > 0 &&
                        subject.teachers[0].user ? (
                          `${subject.teachers[0].user.firstName} ${subject.teachers[0].user.lastName}`
                        ) : (
                          <span className="text-muted-foreground italic">
                            Professeur non assigné
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
