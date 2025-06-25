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
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function AppHeader() {
  const { data: session, status, update } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const success = searchParams.get("success");
    if (success === "true") {
      update().then(() => {
        const newParams = new URLSearchParams(searchParams.toString());
        newParams.delete("success");
        router.replace(`?${newParams.toString()}`);
      });
    }

    if (status === "loading") return;
  }, [searchParams, update, router, status]);

  const firstName = session?.user?.firstName || "";
  const lastName = session?.user?.lastName || "";
  const fullName = `${firstName} ${lastName}`.trim() || "Utilisateur";

  const initials = [firstName, lastName]
    .map((n) => n?.[0] || "")
    .join("")
    .toUpperCase();

  const subscriptionStatus = session?.user?.subscriptionStatus || "FREE_TRIAL";
  console.log("🔍 Subscription status from session:", subscriptionStatus);
  const trialEndsAt = session?.user?.trialEndsAt
    ? new Date(session.user.trialEndsAt)
    : null;

  const formattedDate = trialEndsAt
    ? format(trialEndsAt, "dd MMMM yyyy", { locale: fr })
    : null;

  const label =
    subscriptionStatus === "ACTIVE"
      ? `Abonnement actif`
      : trialEndsAt
        ? `Essai jusqu’au ${formattedDate}`
        : `Plan gratuit`;

  return (
    <header className="flex items-center justify-between px-6 py-3 border-b bg-white">
      <div className="flex items-center gap-3">
        <div className="bg-black text-white rounded-md p-2 text-xs font-bold">
          {initials}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 text-sm font-medium cursor-pointer">
            <div className="text-left">
              <div className="leading-none">{fullName}</div>
              {session?.user?.role !== "SUPER_ADMIN" && (
                <div className="text-xs text-muted-foreground">{label}</div>
              )}
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

      <SupportButton />
    </header>
  );
}
