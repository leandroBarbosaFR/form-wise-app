"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useMediaQuery } from "../app/hooks/useMediaQuery";
import type { TeacherData } from "../types/teacher";

export default function TeacherProfile({ teacher }: { teacher: TeacherData }) {
  const isMobile = useMediaQuery("(max-width: 768px)");

  const rows = [
    {
      label: "Nom",
      value: `${teacher?.user?.firstName} ${teacher?.user?.lastName}`,
    },
    { label: "Email", value: teacher?.user?.email },
    { label: "Téléphone", value: teacher.phone || "Non renseigné" },
    { label: "Adresse", value: teacher.address || "Non renseignée" },
    { label: "Classe assignée", value: teacher.class?.name || "—" },
    { label: "Matière", value: teacher.subject?.name || "—" },
  ];

  return isMobile ? (
    <div className="space-y-4">
      {rows.map((row, i) => (
        <Card key={i}>
          <CardContent className="p-4 space-y-1">
            <p className="text-xs text-muted-foreground">{row.label}</p>
            <p className="text-sm font-medium">{row.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  ) : (
    <div className="overflow-x-auto rounded-md border shadow-sm">
      <table className="min-w-full text-sm">
        <thead className="bg-muted text-muted-foreground uppercase text-xs">
          <tr>
            <th className="px-4 py-3 text-left">Champ</th>
            <th className="px-4 py-3 text-left">Valeur</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {rows.map((row, i) => (
            <tr key={i}>
              <td className="px-4 py-2 font-medium">{row.label}</td>
              <td className="px-4 py-2">{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
