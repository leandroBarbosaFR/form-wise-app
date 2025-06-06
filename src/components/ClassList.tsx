"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Class = {
  id: string;
  name: string;
  monthlyFee: number;
  schoolYear: {
    name: string;
  };
};

export default function ClassList() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchClasses = async () => {
    const res = await fetch("/api/classes", { credentials: "include" });
    const data = await res.json();
    setClasses(data.classes || []);
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/classes/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    const data = await res.json();
    if (data.success) {
      setClasses((prev) => prev.filter((cls) => cls.id !== id));
    }
  };

  if (classes.length === 0) {
    return (
      <p className="text-muted-foreground">
        Aucune classe créée pour l’instant.
      </p>
    );
  }

  return (
    <div className="grid gap-4 mt-6">
      {classes.map((cls) => (
        <Card key={cls.id}>
          <CardContent className="p-4 flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">{cls.name}</p>
                <p className="text-sm text-muted-foreground">
                  Année : {cls.schoolYear.name} – {cls.monthlyFee} € / mois
                </p>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(cls.id)}
              >
                Supprimer 🗑
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
