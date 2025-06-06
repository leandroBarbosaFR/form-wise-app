"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function StudentForm({
  onStudentAdded,
}: {
  onStudentAdded: (student: any) => void;
}) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    birthDate: "",
    address: "",
    hasHealthIssues: "no",
    healthDetails: "",
    canLeaveAlone: "no",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        hasHealthIssues: formData.hasHealthIssues === "yes",
        canLeaveAlone: formData.canLeaveAlone === "yes",
      }),
      credentials: "include",
    });
    const data = await res.json();
    setLoading(false);
    if (data.success) {
      console.log("Élève créé :", data.student);
      onStudentAdded(data.student);
      setFormData({
        firstName: "",
        lastName: "",
        birthDate: "",
        address: "",
        hasHealthIssues: "no",
        healthDetails: "",
        canLeaveAlone: "no",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Prénom</Label>
        <Input
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label>Nom</Label>
        <Input
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label>Date de naissance</Label>
        <Input
          type="date"
          name="birthDate"
          value={formData.birthDate}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label>Adresse</Label>
        <Input
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label>Problèmes de santé ?</Label>
        <RadioGroup
          name="hasHealthIssues"
          defaultValue="no"
          onValueChange={(value) =>
            setFormData({ ...formData, hasHealthIssues: value })
          }
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="no" id="no-health" />
            <Label htmlFor="no-health">Non</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="yes" id="yes-health" />
            <Label htmlFor="yes-health">Oui</Label>
          </div>
        </RadioGroup>
        {formData.hasHealthIssues === "yes" && (
          <div>
            <Label>Précisions</Label>
            <Textarea
              name="healthDetails"
              value={formData.healthDetails}
              onChange={handleChange}
              placeholder="Décrivez les problèmes de santé..."
            />
          </div>
        )}
      </div>
      <div>
        <Label>Peut partir seul ?</Label>
        <RadioGroup
          name="canLeaveAlone"
          defaultValue="no"
          onValueChange={(value) =>
            setFormData({ ...formData, canLeaveAlone: value })
          }
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="no" id="no-alone" />
            <Label htmlFor="no-alone">Non</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="yes" id="yes-alone" />
            <Label htmlFor="yes-alone">Oui</Label>
          </div>
        </RadioGroup>
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? "Ajout..." : "Ajouter l'élève"}
      </Button>
    </form>
  );
}
