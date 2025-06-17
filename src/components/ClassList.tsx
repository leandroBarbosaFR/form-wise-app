"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { UserX } from "lucide-react";

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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
      <p className="text-muted-foreground mt-6">
        Aucune classe créée pour l’instant.
      </p>
    );
  }

  return (
    <div className="mt-6">
      {isMobile ? (
        <div className="space-y-4">
          {classes.map((cls) => (
            <div
              key={cls.id}
              className="rounded border p-4 shadow-sm space-y-2"
            >
              <p className="font-semibold">{cls.name}</p>
              <p className="text-sm text-muted-foreground">
                Année : {cls.schoolYear.name}
              </p>
              <p className="text-sm text-muted-foreground">
                Tarif : {cls.monthlyFee} € / mois
              </p>
              <Button
                className="cursor-pointer"
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(cls.id)}
              >
                <UserX className="h-4 w-4 mr-1" />
                Supprimer
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-md border shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-muted text-muted-foreground uppercase text-xs">
              <tr>
                <th className="px-4 py-3 text-left">Classe</th>
                <th className="px-4 py-3 text-left">Année scolaire</th>
                <th className="px-4 py-3 text-left">Tarif mensuel</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {classes.map((cls) => (
                <tr key={cls.id} className="hover:bg-muted/20">
                  <td className="px-4 py-2 font-medium">{cls.name}</td>
                  <td className="px-4 py-2">{cls.schoolYear.name}</td>
                  <td className="px-4 py-2">{cls.monthlyFee} €</td>
                  <td className="px-4 py-2 text-right">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(cls.id)}
                      className="cursor-pointer"
                    >
                      <UserX className="h-4 w-4 mr-1 cursor-pointer" />
                      Supprimer
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
