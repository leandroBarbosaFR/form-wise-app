// SubjectForm.tsx
"use client";
import { useEffect, useState } from "react";
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
import { Plus } from "lucide-react";

type Class = {
  id: string;
  name: string;
};

export default function SubjectForm() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [subjectName, setSubjectName] = useState("");

  useEffect(() => {
    fetch("/api/classes")
      .then((res) => res.json())
      .then((data) => setClasses(data.classes));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await fetch("/api/subjects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name: subjectName, classId: selectedClassId }),
    });

    setSubjectName("");
    setSelectedClassId("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <Label>Classe</Label>
      <Select value={selectedClassId} onValueChange={setSelectedClassId}>
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

      <div>
        <Label>Nom de la matière</Label>
        <Input
          value={subjectName}
          onChange={(e) => setSubjectName(e.target.value)}
          required
        />
      </div>

      <Button type="submit">
        Ajouter la matière <Plus />
      </Button>
    </form>
  );
}
