"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

type Student = {
  id: string;
  firstName: string;
  lastName: string;
  address: string;
  parent: {
    firstName: string;
    lastName: string;
    email: string;
  };
};

export default function PendingStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPending = async () => {
      const res = await fetch("/api/students/pending");
      const data = await res.json();
      setStudents(data);
    };

    fetchPending();
  }, []);

  const updateStatus = async (id: string, status: "APPROVED" | "REJECTED") => {
    setLoading(true);
    const res = await fetch(`/api/students/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    if (res.ok) {
      toast.success(`Élève ${status === "APPROVED" ? "approuvé" : "rejeté"}`);
      setStudents((prev) => prev.filter((s) => s.id !== id));
    } else {
      toast.error("Erreur lors de la mise à jour");
    }

    setLoading(false);
  };

  if (students.length === 0) {
    return (
      <p className="text-center text-sm text-gray-500">
        Aucun élève en attente.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {/* Desktop table */}
      <div className="hidden lg:block">
        <table className="min-w-full border rounded overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-3">Nom</th>
              <th className="text-left p-3">Adresse</th>
              <th className="text-left p-3">Parent</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} className="border-t">
                <td className="p-3">
                  {student.firstName} {student.lastName}
                </td>
                <td className="p-3">{student.address}</td>
                <td className="p-3">
                  {student.parent.firstName} {student.parent.lastName} <br />
                  <span className="text-sm text-gray-500">
                    {student.parent.email}
                  </span>
                </td>
                <td className="p-3 space-x-2">
                  <Button
                    variant="outline"
                    className="cursor-pointer"
                    onClick={() => updateStatus(student.id, "APPROVED")}
                    disabled={loading}
                  >
                    Approuver
                  </Button>
                  <Button
                    variant="destructive"
                    className="cursor-pointer"
                    onClick={() => updateStatus(student.id, "REJECTED")}
                    disabled={loading}
                  >
                    Rejeter
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="lg:hidden space-y-4">
        {students.map((student) => (
          <Card key={student.id}>
            <CardContent className="p-4 space-y-2">
              <p className="font-semibold">
                {student.firstName} {student.lastName}
              </p>
              <p className="text-sm text-gray-600">
                Adresse : {student.address}
              </p>
              <p className="text-sm text-gray-600">
                Parent : {student.parent.firstName} {student.parent.lastName}{" "}
                <br />
                <span className="text-gray-500">{student.parent.email}</span>
              </p>
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  className="cursor-pointer"
                  onClick={() => updateStatus(student.id, "APPROVED")}
                  disabled={loading}
                >
                  Approuver
                </Button>
                <Button
                  variant="destructive"
                  className="cursor-pointer"
                  onClick={() => updateStatus(student.id, "REJECTED")}
                  disabled={loading}
                >
                  Rejeter
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
