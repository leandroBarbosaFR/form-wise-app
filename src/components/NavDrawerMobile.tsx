"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import Link from "next/link";

interface Props {
  open: boolean;
  onClose: (open: boolean) => void;
}

const navigation = [{ name: "Contactez-nous", href: "/contact" }];

export default function NavDrawerMobile({ open, onClose }: Props) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="inset-y-0 right-0 w-full max-w-sm p-6 lg:hidden">
        {/* Accessible title (required by Radix) */}
        <DialogHeader>
          <DialogTitle className="sr-only">Menu mobile</DialogTitle>
        </DialogHeader>

        {/* Close button in top-right corner */}
        <button
          type="button"
          onClick={() => onClose(false)}
          className="absolute top-4 right-4 rounded-md p-2 text-gray-700 hover:bg-gray-100"
        >
          <span className="sr-only">Fermer</span>
          <X className="size-6" />
        </button>

        {/* Menu */}
        <div className="flex flex-col items-center gap-6 mt-10">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-base font-semibold text-gray-900 hover:text-indigo-600"
              onClick={() => onClose(false)}
            >
              {item.name}
            </Link>
          ))}

          <Link
            href="/login"
            className="text-base font-semibold text-gray-900 hover:text-indigo-600"
            onClick={() => onClose(false)}
          >
            Connexion →
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}
