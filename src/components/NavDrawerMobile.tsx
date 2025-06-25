"use client";

import { X } from "lucide-react";
import Link from "next/link";
import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  open: boolean;
  onClose: (value: boolean) => void;
}

export default function NavDrawerMobile({ open, onClose }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm">
      <div
        className="fixed w-full h-full bg-white shadow-xl p-6 z-50"
        style={{
          background: "linear-gradient(0deg, #DEE9EE 0%, #F3F7F9 100%)",
        }}
      >
        <div className="flex justify-between items-center">
          <Link href={"/"} className="flex justify-center items-center gap-2">
            <Zap className="text-indigo-600" />
            <h1 className="text-xl font-bold text-gray-900">Formwise</h1>
          </Link>
          <button onClick={() => onClose(false)}>
            <X className="h-6 w-6 text-gray-700 cursor-pointer" />
          </button>
        </div>

        <nav className="absolute top-1/2 -translate-y-1/2 flex flex-col gap-4">
          <Link
            href="/contact"
            onClick={() => onClose(false)}
            className="text-sm font-medium text-gray-900"
          >
            Contactez-nous
          </Link>
          <Link href="/login" target="_blank">
            <Button className="cursor-pointer">Connexion</Button>
          </Link>
        </nav>
      </div>
    </div>
  );
}
