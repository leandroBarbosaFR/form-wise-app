"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function StaffForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [roleLabel, setRoleLabel] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/invite-staff", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        phone,
        roleLabel,
      }),
    });

    if (res.ok) {
      toast.success("Invitation envoyée au staff !");
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setRoleLabel("");
    } else {
      toast.error("Erreur lors de l'envoi de l'invitation.");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <div>
        <Label>Prénom</Label>
        <Input
          type="text"
          placeholder="Jean"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
      </div>

      <div>
        <Label>Nom</Label>
        <Input
          type="text"
          placeholder="Dupont"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
      </div>

      <div>
        <Label>Email</Label>
        <Input
          type="email"
          placeholder="exemple@ecole.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div>
        <Label>Téléphone</Label>
        <Input
          type="tel"
          placeholder="+33 6 12 34 56 78"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      <div>
        <Label>Fonction (libre)</Label>
        <Input
          type="text"
          placeholder="Secrétaire, Assistant, etc."
          value={roleLabel}
          onChange={(e) => setRoleLabel(e.target.value)}
        />
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Envoi en cours..." : "Inviter le staff"}
      </Button>
    </form>
  );
}
