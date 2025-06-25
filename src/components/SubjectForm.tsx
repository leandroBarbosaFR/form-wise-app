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

  const loadClasses = async () => {
    const res = await fetch("/api/classes");
    const data = await res.json();
    setClasses(data.classes || []);
  };

  useEffect(() => {
    loadClasses();
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

    await loadClasses(); // 🔁 mise à jour propre ici
  };

  return (
    <form onSubmit={handleSubmit} className=" flex flex-col gap-2 max-w-md">
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
      <div className="flex flex-col gap-2">
        <Label>Nom de la matière</Label>
        <Input
          value={subjectName}
          onChange={(e) => setSubjectName(e.target.value)}
          required
        />
      </div>
      <Button type="submit" className="cursor-pointer">
        Ajouter la matière <Plus />
      </Button>
    </form>
  );
}
