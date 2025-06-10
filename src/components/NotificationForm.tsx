"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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

export default function NotificationForm({ onSent }: { onSent?: () => void }) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [students, setStudents] = useState<Student[]>([]);
  const [studentId, setStudentId] = useState<string | null>(null);
  const [success, setSuccess] = useState("");
  const [isGlobal, setIsGlobal] = useState(true);

  useEffect(() => {
    if (!isGlobal) {
      fetch("/api/students/all") // ← ici
        .then((res) => res.json())
        .then((data) => {
          console.log("🎓 élèves récupérés :", data.students);
          setStudents(data.students || []);
        });
    }
  }, [isGlobal]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        message,
        isGlobal,
        studentId: isGlobal ? null : studentId,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Erreur API:", errorText);
      return;
    }

    const data = await res.json();

    if (data.success) {
      setSuccess("✅ Notification envoyée");
      setMessage("");
      setStudentId(null);
      setIsGlobal(true);
      onSent?.();
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
        <Label>Titre</Label>
        <Input
          placeholder="Titre de la notification"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <Label>Message</Label>
        <Input
          placeholder="Entrez le message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
      </div>

      <div>
        <Label>Type de notification</Label>
        <Select
          value={isGlobal ? "global" : "student"}
          onValueChange={(value) => setIsGlobal(value === "global")}
        >
          <SelectTrigger>
            <SelectValue placeholder="Choisir le type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="global">Tous les parents</SelectItem>
            <SelectItem value="student">Un élève spécifique</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {!isGlobal && (
        <div>
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

      <Button type="submit">Envoyer</Button>
    </form>
  );
}
