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
      <h4 className="text-md font-medium text-white">Élève {index + 1}</h4>

      <div className="space-y-2">
        <Label htmlFor={`children.${index}.firstName`} className="text-white">
          Prénom
        </Label>
        <Input
          className="bg-white text-black"
          id={`children.${index}.firstName`}
          {...registerAction(`children.${index}.firstName`)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`children.${index}.lastName`} className="text-white">
          Nom
        </Label>
        <Input
          className="bg-white text-black"
          id={`children.${index}.lastName`}
          {...registerAction(`children.${index}.lastName`)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`children.${index}.gender`} className="text-white">
          Sexe
        </Label>
        <select
          id={`children.${index}.gender`}
          {...registerAction(`children.${index}.gender`)}
          className="w-full border rounded-md p-2 bg-white text-black"
        >
          <option value="FILLE">Fille</option>
          <option value="GARÇON">Garçon</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`children.${index}.birthDate`} className="text-white">
          Date de naissance
        </Label>
        <Input
          type="date"
          className="bg-white text-black"
          id={`children.${index}.birthDate`}
          {...registerAction(`children.${index}.birthDate`)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`children.${index}.birthCity`} className="text-white">
          Ville de naissance
        </Label>
        <Input
          className="bg-white text-black"
          id={`children.${index}.birthCity`}
          {...registerAction(`children.${index}.birthCity`)}
        />
      </div>

      <div className="space-y-2">
        <Label
          htmlFor={`children.${index}.birthCountry`}
          className="text-white"
        >
          Pays de naissance
        </Label>
        <Input
          className="bg-white text-black"
          id={`children.${index}.birthCountry`}
          {...registerAction(`children.${index}.birthCountry`)}
        />
      </div>

      <div className="space-y-2">
        <Label
          htmlFor={`children.${index}.currentSchool`}
          className="text-white"
        >
          Établissement actuel
        </Label>
        <Input
          className="bg-white text-black"
          id={`children.${index}.currentSchool`}
          {...registerAction(`children.${index}.currentSchool`)}
        />
      </div>

      <div className="space-y-2">
        <Label
          htmlFor={`children.${index}.desiredClass`}
          className="text-white"
        >
          Classe souhaitée
        </Label>
        <Input
          className="bg-white text-black"
          id={`children.${index}.desiredClass`}
          {...registerAction(`children.${index}.desiredClass`)}
        />
      </div>
    </div>
  );
}
