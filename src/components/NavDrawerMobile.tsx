"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import Image from "next/image";
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
        <DialogHeader>
          <DialogTitle className="sr-only">Menu mobile</DialogTitle>
        </DialogHeader>
        <div className="flex items-center justify-between">
          <Link href="/" className="-m-1.5 p-1.5">
            <Image
              alt="Formwise logo"
              src="/logo.svg"
              width={32}
              height={32}
              className="h-8 w-auto"
            />
          </Link>
          <button
            type="button"
            onClick={() => onClose(false)}
            className="-m-2.5 rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Fermer</span>
            <X className="size-6" />
          </button>
        </div>
        <div className="mt-6 flow-root">
          <div className="-my-6 divide-y divide-gray-500/10">
            <div className="space-y-2 py-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50"
                >
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="py-6">
              <Link
                href="/login"
                className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold text-gray-900 hover:bg-gray-50"
              >
                Connexion
              </Link>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
