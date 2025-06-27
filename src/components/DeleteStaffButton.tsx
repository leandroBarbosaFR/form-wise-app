"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useState } from "react";

type DeleteStaffButtonProps = {
  staffId: string;
  staffName: string;
  onDeletedAction: (id: string) => void;
};

export default function DeleteStaffButton({
  staffId,
  staffName,
  onDeletedAction,
}: DeleteStaffButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/staffs/${staffId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        onDeletedAction(staffId);
        setOpen(false);
      } else {
        console.error("Erreur lors de la suppression");
      }
    } catch (err) {
      console.error("Erreur réseau", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="destructive"
          size="icon"
          className="bg-red-100 text-red-600 transition-colors hover:bg-red-200 hover:text-red-700 cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Supprimer {staffName} ?</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Cette action est irréversible. Voulez-vous vraiment supprimer ce
          membre ?
        </p>
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Annuler
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
            className="cursor-pointer"
          >
            {loading ? "Suppression..." : "Supprimer"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
