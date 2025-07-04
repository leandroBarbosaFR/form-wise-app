"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UseFormRegister } from "react-hook-form";
import { PreRegistrationFormData } from "./schemas/preRegistration";

interface ChildFormProps {
  index: number;
  registerAction: UseFormRegister<PreRegistrationFormData>;
}

export default function ChildForm({ index, registerAction }: ChildFormProps) {
  return (
    <div className="space-y-4">
      <h4 className="text-md font-medium">Élève {index + 1}</h4>

      <div className="space-y-2">
        <Label htmlFor={`children.${index}.firstName`}>Prénom</Label>
        <Input
          id={`children.${index}.firstName`}
          {...registerAction(`children.${index}.firstName`)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`children.${index}.lastName`}>Nom</Label>
        <Input
          id={`children.${index}.lastName`}
          {...registerAction(`children.${index}.lastName`)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`children.${index}.gender`}>Sexe</Label>
        <select
          id={`children.${index}.gender`}
          {...registerAction(`children.${index}.gender`)}
          className="w-full border rounded-md p-2"
        >
          <option value="FILLE">Fille</option>
          <option value="GARÇON">Garçon</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`children.${index}.birthDate`}>Date de naissance</Label>
        <Input
          type="date"
          id={`children.${index}.birthDate`}
          {...registerAction(`children.${index}.birthDate`)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`children.${index}.birthCity`}>
          Ville de naissance
        </Label>
        <Input
          id={`children.${index}.birthCity`}
          {...registerAction(`children.${index}.birthCity`)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`children.${index}.birthCountry`}>
          Pays de naissance
        </Label>
        <Input
          id={`children.${index}.birthCountry`}
          {...registerAction(`children.${index}.birthCountry`)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`children.${index}.currentSchool`}>
          Établissement actuel
        </Label>
        <Input
          id={`children.${index}.currentSchool`}
          {...registerAction(`children.${index}.currentSchool`)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`children.${index}.desiredClass`}>
          Classe souhaitée
        </Label>
        <Input
          id={`children.${index}.desiredClass`}
          {...registerAction(`children.${index}.desiredClass`)}
        />
      </div>
    </div>
  );
}
