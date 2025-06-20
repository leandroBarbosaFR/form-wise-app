"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import Link from "next/link";
import { Zap } from "lucide-react";

export default function ContactFormPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    role: "",
    subject: "",
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success("Votre message a bien été envoyé !");
        setFormData({
          role: "",
          subject: "",
          name: "",
          email: "",
          phone: "",
          message: "",
        });
      } else {
        toast.error("Une erreur est survenue. Veuillez réessayer.");
      }
    } catch (error) {
      console.log(error);
      toast.error("Erreur serveur. Veuillez réessayer plus tard.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8  h-full">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center items-center gap-2">
          <Link href="/" className="flex justify-center items-center gap-2">
            <Zap className="text-indigo-600" />
            <h1 className="text-xl font-bold text-gray-900">Formwise</h1>
          </Link>
        </div>
        <h2 className="mt-6 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          Contactez-nous
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label>Je suis...</Label>
              <Select
                value={formData.role}
                onValueChange={(val) => handleChange("role", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir un profil" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="parent">Un parent</SelectItem>
                  <SelectItem value="directeur">
                    Un directeur d&apos;établissement
                  </SelectItem>
                  <SelectItem value="association">Une association</SelectItem>
                  <SelectItem value="autre">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Nom</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Sujet</Label>
              <Select
                value={formData.subject}
                onValueChange={(val) => handleChange("subject", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un sujet" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Être contacté pour une offre">
                    Être contacté pour une offre
                  </SelectItem>
                  <SelectItem value="Demande de renseignements">
                    Demande de renseignements
                  </SelectItem>
                  <SelectItem value="Demande de support">
                    Demande de support
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => handleChange("message", e.target.value)}
                required
                rows={5}
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full cursor-pointer"
            >
              {loading ? "Envoi en cours..." : "Envoyer ma demande"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
