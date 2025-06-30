"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  LogOut,
  Crown,
  Ban,
  FileText,
  ShieldCheck,
  Gavel,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import SupportButton from "./SupportButton";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";

export default function AppHeader() {
  const { data: session, status, update } = useSession();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const schoolCode = session?.user?.schoolCode || null;

  useEffect(() => {
    const success = searchParams?.get("success") ?? null;

    if (success === "true" && !isRefreshing) {
      setIsRefreshing(true);

      (async () => {
        try {
          await new Promise((resolve) => setTimeout(resolve, 2000));
          await update({ trigger: "update" });
          await new Promise((resolve) => setTimeout(resolve, 1000));
          toast.success("Abonnement activé avec succès !");
        } catch (err) {
          console.error("Erreur de mise à jour de session :", err);
          toast.error("Erreur lors de la mise à jour de la session");
        } finally {
          const newParams = new URLSearchParams(searchParams?.toString());
          newParams.delete("success");
          router.replace(`?${newParams.toString()}`, { scroll: false });
          setIsRefreshing(false);
        }
      })();
    }
  }, [searchParams, update, router, isRefreshing]);

  if (status === "loading") return null;

  const firstName = session?.user?.firstName || "";
  const lastName = session?.user?.lastName || "";
  const fullName = `${firstName} ${lastName}`.trim() || "Utilisateur";
  const initials = [firstName, lastName]
    .map((n) => n?.[0] || "")
    .join("")
    .toUpperCase();

  const billingPlan = session?.user?.billingPlan || "MONTHLY";
  const subscriptionStatus = session?.user?.subscriptionStatus || "FREE_TRIAL";
  const trialEndsAt = session?.user?.trialEndsAt
    ? new Date(session.user.trialEndsAt)
    : null;
  const formattedDate = trialEndsAt
    ? format(trialEndsAt, "dd MMMM yyyy", { locale: fr })
    : null;

  const label =
    subscriptionStatus === "ACTIVE"
      ? billingPlan === "MONTHLY"
        ? formattedDate
          ? `Mensuel – Renouvelle le ${formattedDate}`
          : "Abonnement mensuel"
        : formattedDate
          ? `Annuel – Renouvelle le ${formattedDate}`
          : "Abonnement annuel"
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
              {!["SUPER_ADMIN", "TEACHER", "PARENT", "STAFF"].includes(
                session?.user?.role || ""
              ) && (
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
              <>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => router.push("/dashboard/billing")}
                >
                  <Crown className="w-4 h-4 mr-2" />
                  <span className="text-sm">Upgrade mon forfait</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => router.push("/dashboard/resiliation")}
                >
                  <Ban className="w-4 h-4 mr-2" />
                  <span className="text-sm">Résilier mon abonnement</span>
                </DropdownMenuItem>
              </>
            )}

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => router.push("/politique-de-confidentialite")}
            >
              <ShieldCheck className="w-4 h-4 mr-2" />
              <span className="text-sm">Politique de confidentialité</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => router.push("/conditions-utilisation")}
            >
              <FileText className="w-4 h-4 mr-2" />
              <span className="text-sm">Conditions d&apos;utilisation</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => router.push("/conditions-generales")}
            >
              <Gavel className="w-4 h-4 mr-2" />
              <span className="text-sm">Conditions générales de service</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => signOut()}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Se déconnecter
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {schoolCode && (
        <div className="hidden md:flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
          <span>Code établissement :</span>
          <span className="font-medium">{schoolCode}</span>
          <button
            onClick={() => {
              navigator.clipboard.writeText(schoolCode);
              toast.success("Code copié !");
            }}
            className="hover:text-black transition cursor-pointer"
            title="Copier le code"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 16h8a2 2 0 002-2V6a2 2 0 00-2-2H8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 8h2a2 2 0 012 2v8a2 2 0 01-2 2H10a2 2 0 01-2-2v-2"
              />
            </svg>
          </button>
        </div>
      )}

      <div className="hidden md:block">
        <SupportButton />
      </div>
    </header>
  );
}
