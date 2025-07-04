"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UseFormRegister } from "react-hook-form";
import { PreRegistrationFormData } from "./schemas/preRegistration";

interface ParentFormProps {
  registerAction: UseFormRegister<PreRegistrationFormData>;
}

export default function ParentForm({ registerAction }: ParentFormProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Responsable légal</h3>

      <div className="space-y-2">
        <Label htmlFor="parent.firstName">Prénom</Label>
        <Input id="parent.firstName" {...registerAction("parent.firstName")} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="parent.lastName">Nom</Label>
        <Input id="parent.lastName" {...registerAction("parent.lastName")} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="parent.email">Email</Label>
        <Input
          id="parent.email"
          type="email"
          {...registerAction("parent.email")}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="parent.phone">Téléphone</Label>
        <Input
          id="parent.phone"
          type="tel"
          {...registerAction("parent.phone")}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="parent.address">Adresse</Label>
        <Input id="parent.address" {...registerAction("parent.address")} />
      </div>
    </div>
  );
}
