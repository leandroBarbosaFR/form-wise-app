"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function InviteTeacherForm({
  onInvited,
}: {
  onInvited?: () => void;
}) {
  const [success, setSuccess] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/invite-teacher", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          firstName,
          lastName,
          phone: "0000000000",
        }),
      });

      let data;
      try {
        data = await res.json();
      } catch (err) {
        console.error("❌ Erreur parsing JSON:", err);
        throw new Error("Réponse invalide du serveur");
      }
      if (data.success) {
        setSuccess(`Invitation envoyée à ${email}`);
        setEmail("");
        setFirstName("");
        setLastName("");
        if (onInvited) onInvited();
      } else {
        setError(data.error || "Une erreur est survenue");
      }
    } catch (err) {
      console.error("Erreur lors de l'envoi de l'invitation :", err);
      setError("Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      {success && (
        <p className="text-green-600 bg-green-100 border p-3 rounded">
          {success}
        </p>
      )}
      {error && (
        <p className="text-red-600 bg-red-100 border p-3 rounded">{error}</p>
      )}

      <div className="flex flex-col gap-2">
        <Label>Prénom</Label>
        <Input
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Nom</Label>
        <Input
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Email</Label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <Button type="submit" disabled={loading} className="cursor-pointer">
        {loading ? "Envoi..." : "Envoyer l’invitation"}
      </Button>
    </form>
  );
}
