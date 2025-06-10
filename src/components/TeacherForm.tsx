"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectContent,
  SelectValue,
} from "@/components/ui/select";
import type { Teacher } from "./TeacherList";

type TeacherFormProps = {
  onCreated?: (teacher: Teacher) => void;
  teacher?: Teacher | null;
};

export default function TeacherForm({ onCreated, teacher }: TeacherFormProps) {
  const [success, setSuccess] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [classId, setClassId] = useState("");

  const [subjects, setSubjects] = useState<{ id: string; name: string }[]>([]);
  const [classes, setClasses] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    if (teacher) {
      setFirstName(teacher.firstName || "");
      setLastName(teacher.lastName || "");
      setSubjectId(teacher.subject?.id || "");
      setClassId(teacher.class?.id || "");
    } else {
      setFirstName("");
      setLastName("");
      setSubjectId("");
      setClassId("");
    }
  }, [teacher]);

  useEffect(() => {
    fetch("/api/subjects")
      .then((res) => res.json())
      .then((data) => setSubjects(data.subjects || []));

    fetch("/api/classes")
      .then((res) => res.json())
      .then((data) => setClasses(data.classes || []));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const method = teacher?.id ? "PUT" : "POST";
    const url = teacher?.id ? `/api/teachers/${teacher.id}` : "/api/teachers";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName, subjectId, classId }),
    });

    const data = await res.json();
    if (data.success) {
      setSuccess(
        teacher?.id
          ? `✅ Professeur mis à jour avec succès`
          : `✅ Professeur ${data.teacher.firstName} ajouté`
      );
      setFirstName("");
      setLastName("");
      setSubjectId("");
      setClassId("");
      onCreated?.(data.teacher);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      {success && (
        <div className="text-green-600 bg-green-100 border p-3 rounded">
          {success}
        </div>
      )}

      <div>
        <Label>Prénom</Label>
        <Input
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
      </div>

      <div>
        <Label>Nom</Label>
        <Input
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
      </div>

      <div>
        <Label>Matière enseignée</Label>
        <Select value={subjectId} onValueChange={setSubjectId}>
          <SelectTrigger>
            <SelectValue placeholder="Choisir une matière" />
          </SelectTrigger>
          <SelectContent>
            {subjects.map((subject) => (
              <SelectItem key={subject.id} value={subject.id}>
                {subject.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Classe</Label>
        <Select value={classId} onValueChange={setClassId}>
          <SelectTrigger>
            <SelectValue placeholder="Choisir une classe" />
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

      <Button type="submit">
        {teacher?.id ? "Mettre à jour le professeur" : "Créer le professeur"}
      </Button>
    </form>
  );
}
