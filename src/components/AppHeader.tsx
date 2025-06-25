"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, LogOut, Crown } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import SupportButton from "./SupportButton";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner"; // Optional, if you're using Sonner

export default function AppHeader() {
  const { data: session, status, update } = useSession();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const success = searchParams.get("success");

    if (success === "true" && !isRefreshing) {
      setIsRefreshing(true);

      (async () => {
        try {
          console.log("🔄 Forcing session update after payment success...");
          console.log("📊 Current session before update:", session);

          // Wait a bit to ensure webhook has processed
          await new Promise((resolve) => setTimeout(resolve, 2000));

          // Force session refresh with trigger
          const result = await update();
          console.log("📊 Update result:", result);

          // Wait for the update to propagate
          await new Promise((resolve) => setTimeout(resolve, 1000));

          toast.success("Abonnement activé avec succès !");
        } catch (err) {
          console.error("Failed to refresh session:", err);
          toast.error("Erreur lors de la mise à jour de la session");
        } finally {
          // Clean up URL
          const newParams = new URLSearchParams(searchParams.toString());
          newParams.delete("success");
          router.replace(`?${newParams.toString()}`, { scroll: false });
          setIsRefreshing(false);
        }
      })();
    }
  }, [searchParams, update, router, isRefreshing, session]);

  // Add debugging
  console.log("🔍 Session data:", session);
  console.log("🔍 Subscription status:", session?.user?.subscriptionStatus);

  if (status === "loading") return null;

  const firstName = session?.user?.firstName || "";
  const lastName = session?.user?.lastName || "";
  const fullName = `${firstName} ${lastName}`.trim() || "Utilisateur";

  const initials = [firstName, lastName]
    .map((n) => n?.[0] || "")
    .join("")
    .toUpperCase();

  const subscriptionStatus = session?.user?.subscriptionStatus || "FREE_TRIAL";
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
        ? `Essai jusqu'au ${formattedDate}`
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
              {session?.user?.role !== "SUPER_ADMIN" &&
                session?.user?.role !== "TEACHER" &&
                session?.user?.role !== "PARENT" && (
                  <div className="text-xs text-muted-foreground">
                    {label}
                    {isRefreshing && " (mise à jour...)"}
                  </div>
                )}
            </div>
            <ChevronDown className="w-4 h-4 ml-1" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {session?.user?.role === "DIRECTOR" && (
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => router.push("/dashboard/billing")}
              >
                <Crown className="w-4 h-4 ml-1" />
                <span className="text-sm">Upgrade mon forfait</span>
              </DropdownMenuItem>
            )}
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
