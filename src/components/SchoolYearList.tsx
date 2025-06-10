"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, UserX } from "lucide-react";

type SchoolYear = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
};

export default function SchoolYearList() {
  const [schoolYears, setSchoolYears] = useState<SchoolYear[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSchoolYears = async () => {
    setLoading(true);
    const res = await fetch("/api/school-year", {
      credentials: "include",
    });
    const data = await res.json();
    setSchoolYears(data.schoolYears || []);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    const confirm = window.confirm("Confirmer la suppression de cette année ?");
    if (!confirm) return;

    const res = await fetch(`/api/school-year/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (res.ok) {
      setSchoolYears((prev) => prev.filter((y) => y.id !== id));
    }
  };

  useEffect(() => {
    fetchSchoolYears();
  }, []);

  return (
    <div className="space-y-4 mt-6">
      {schoolYears.length === 0 ? (
        <div className="text-muted-foreground flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          Aucune année scolaire enregistrée.
        </div>
      ) : (
        schoolYears.map((year) => (
          <Card key={year.id}>
            <CardContent className="flex justify-between items-center p-4">
              <div>
                <div className="font-semibold">{year.name}</div>
                <div className="text-sm text-muted-foreground">
                  Du {new Date(year.startDate).toLocaleDateString()} au{" "}
                  {new Date(year.endDate).toLocaleDateString()}
                </div>
              </div>
              <Button
                variant="destructive"
                onClick={() => handleDelete(year.id)}
              >
                Supprimer <UserX />
              </Button>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
