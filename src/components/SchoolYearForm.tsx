"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function SchoolYearForm({
  onCreated,
}: {
  onCreated: () => void;
}) {
  const [formData, setFormData] = useState({
    name: "",
    startDate: "",
    endDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/school-year", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
      credentials: "include",
    });

    const data = await res.json();
    setLoading(false);

    if (data.success) {
      setSuccessMessage(`✅ Année "${data.schoolYear.name}" créée avec succès`);
      setFormData({ name: "", startDate: "", endDate: "" });
      onCreated();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      {successMessage && (
        <div className="text-green-600 bg-green-100 border border-green-300 rounded p-3">
          {successMessage}
        </div>
      )}
      <div>
        <Label>Nom de l’année scolaire</Label>
        <Input
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label>Date de début</Label>
        <Input
          name="startDate"
          type="date"
          value={formData.startDate}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label>Date de fin</Label>
        <Input
          name="endDate"
          type="date"
          value={formData.endDate}
          onChange={handleChange}
          required
        />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? "Création..." : "Créer l’année scolaire"}
      </Button>
    </form>
  );
}
