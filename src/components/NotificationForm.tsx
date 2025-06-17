"use client";

import { useState, useEffect } from "react";
import { Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

type Student = {
  id: string;
  firstName: string;
  lastName: string;
};

type Teacher = {
  id: string;
  user: {
    firstName: string;
    lastName: string;
  };
};

export default function NotificationForm({ onSent }: { onSent?: () => void }) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [students, setStudents] = useState<Student[]>([]);
  const [studentId, setStudentId] = useState<string | null>(null);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [teacherId, setTeacherId] = useState<string | null>(null);

  const [targetType, setTargetType] = useState<
    "global_parents" | "student" | "global_teachers" | "teacher"
  >("global_parents");

  useEffect(() => {
    if (targetType === "student") {
      fetch("/api/students/all")
        .then((res) => res.json())
        .then((data) => {
          setStudents(data.students || []);
        });
    } else if (targetType === "teacher") {
      fetch("/api/teachers")
        .then((res) => res.json())
        .then((data) => {
          setTeachers(data.teachers || []);
        });
    }
  }, [targetType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        message,
        targetType,
        studentId: targetType === "student" ? studentId : null,
        teacherId: targetType === "teacher" ? teacherId : null,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Erreur API:", errorText);
      toast.error("Erreur lors de l'envoi");
      return;
    }

    const data = await res.json();

    if (data.success) {
      toast.success("Notification envoyée avec succès");
      setTitle("");
      setMessage("");
      setStudentId(null);
      setTeacherId(null);
      setTargetType("global_parents");
      onSent?.();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <div className="flex flex-col gap-2">
        <Label>Titre</Label>
        <Input
          placeholder="Titre de la notification"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Message</Label>
        <Input
          placeholder="Entrez le message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Type de notification</Label>
        <Select
          value={targetType}
          onValueChange={(value) => setTargetType(value as typeof targetType)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Choisir le type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="global_parents">Tous les parents</SelectItem>
            <SelectItem value="student">Un élève spécifique</SelectItem>
            <SelectItem value="global_teachers">
              Tous les enseignants
            </SelectItem>
            <SelectItem value="teacher">Un enseignant spécifique</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {targetType === "student" && (
        <div className="flex flex-col gap-2">
          <Label>Choisir l’élève</Label>
          <Select
            value={studentId || ""}
            onValueChange={(value) => setStudentId(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un élève" />
            </SelectTrigger>
            <SelectContent>
              {students.map((student) => (
                <SelectItem key={student.id} value={student.id}>
                  {student.firstName} {student.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {targetType === "teacher" && (
        <div className="flex flex-col gap-2">
          <Label>Choisir l’enseignant</Label>
          <Select
            value={teacherId || ""}
            onValueChange={(value) => setTeacherId(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un enseignant" />
            </SelectTrigger>
            <SelectContent>
              {teachers.map((teacher) => (
                <SelectItem key={teacher.id} value={teacher.id}>
                  {teacher.user.firstName} {teacher.user.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <Button type="submit" className="cursor-pointer">
        Envoyer <Send />
      </Button>
    </form>
  );
}
