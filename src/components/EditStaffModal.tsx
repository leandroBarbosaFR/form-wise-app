"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useState } from "react";

export type Staff = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  roleLabel: string;
};

type EditStaffModalProps = {
  staff: Staff;
  onSaveAction: (updatedStaff: Staff) => void;
};

export default function EditStaffModal({
  staff,
  onSaveAction,
}: EditStaffModalProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<Staff>(staff);
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof Staff, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/staffs/${staff.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        onSaveAction(formData);
        setOpen(false);
      } else {
        console.error("Erreur de mise à jour");
      }
    } catch (error) {
      console.error("Erreur réseau", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer" variant="outline" size="icon">
          <Pencil className="w-4 h-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Modifier le membre</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Prénom</Label>
            <Input
              value={formData.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
            />
          </div>
          <div>
            <Label>Nom</Label>
            <Input
              value={formData.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
            />
          </div>
          <div>
            <Label>Email</Label>
            <Input
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              type="email"
            />
          </div>
          <div>
            <Label>Téléphone</Label>
            <Input
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
          </div>
          <div>
            <Label>Fonction</Label>
            <Input
              value={formData.roleLabel}
              onChange={(e) => handleChange("roleLabel", e.target.value)}
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full cursor-pointer"
          >
            {loading ? "Sauvegarde..." : "Enregistrer"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
