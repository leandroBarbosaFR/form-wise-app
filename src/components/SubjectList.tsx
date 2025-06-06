"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
    <div className="space-y-6">
      <div>
        <Label>Choisir une classe</Label>
        <Select onValueChange={setSelectedClassId}>
          <SelectTrigger>
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
        <div className="grid gap-4">
          {filteredSubjects.length === 0 ? (
            <p className="text-muted-foreground">
              Aucune matière pour cette classe.
            </p>
          ) : (
            filteredSubjects.map((subject) => (
              <Card key={subject.id}>
                <CardContent className="p-4">
                  <p className="font-medium">{subject.name}</p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
