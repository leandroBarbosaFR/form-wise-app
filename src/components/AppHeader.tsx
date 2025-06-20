"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import SupportButton from "./SupportButton";

export default function AppHeader() {
  const { data: session } = useSession();

  const firstName = session?.user?.firstName || "";
  const lastName = session?.user?.lastName || "";
  const fullName = `${firstName} ${lastName}`.trim() || "Utilisateur";

  const initials = [firstName, lastName]
    .map((n) => n?.[0] || "")
    .join("")
    .toUpperCase();

  return (
    <header className="flex items-center justify-between px-6 py-3 border-b bg-white">
      {/* Left: Logo + User */}
      <div className="flex items-center gap-3">
        <div className="bg-black text-white rounded-md p-2 text-xs font-bold">
          {initials}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 text-sm font-medium cursor-pointer">
            <div className="text-left">
              <div className="leading-none">{fullName}</div>
              {/* <div className="text-xs text-muted-foreground">{company}</div> */}
            </div>
            <ChevronDown className="w-4 h-4 ml-1" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => signOut()}
            >
              <LogOut className="w-4 h-4 mr-2 cursor-pointer" />
              Se déconnecter
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Right: Support */}
      <SupportButton />
    </header>
  );
}
