"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Tenant } from "@prisma/client";

interface Props {
  tenant: Omit<Tenant, "status"> & {
    status: string | null;
    users: {
      email: string;
      firstName: string;
      lastName: string;
      phone?: string | null;
      address?: string | null;
    }[];
  };
}

function CustomBadge({ label, color }: { label: string; color: string }) {
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${color}`}
    >
      {label}
    </span>
  );
}

function getPlanLabel(plan: string) {
  switch (plan) {
    case "FREE_TRIAL":
      return {
        label: "Essai gratuit",
        color: "bg-[#e8f7ee] text-[#2fbf6c] ring-green-600/20",
      };
    case "MONTHLY":
      return {
        label: "Mensuel",
        color: "bg-[#f0f9ff] text-[#3b82f6] ring-blue-400/30",
      };
    case "YEARLY":
      return {
        label: "Annuel",
        color: "bg-[#eef2ff] text-[#6366f1] ring-indigo-400/30",
      };
    default:
      return {
        label: "Inconnu",
        color: "bg-gray-200 text-gray-600 ring-gray-400/30",
      };
  }
}

function getStatusLabel(status: string) {
  return status === "ACTIVE"
    ? { label: "Actif", color: "bg-[#e8f7ee] text-[#2fbf6c] ring-green-600/20" }
    : { label: "Désactivé", color: "bg-red-100 text-red-600 ring-red-500/20" };
}

export default function TenantDetailCard({ tenant }: Props) {
  const director = tenant.users[0];
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState(tenant.status || "ACTIVE");

  const toggleStatus = async () => {
    startTransition(async () => {
      const newStatus = status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
      await fetch(`/api/superadmin/tenants/${tenant.id}/status`, {
        method: "PUT",
        body: JSON.stringify({ status: newStatus }),
      });
      setStatus(newStatus);
    });
  };

  return (
    <>
      {/* TABLEAU DESKTOP */}
      <div className="hidden md:block border p-4">
        <table className="min-w-full text-sm border rounded-lg overflow-hidden">
          <tbody>
            <tr className="border-b">
              <td className="px-4 py-3 font-semibold">Nom</td>
              <td className="px-4 py-3">{tenant.name}</td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 font-semibold">N° École</td>
              <td className="px-4 py-3">{tenant.uniqueNumber || "-"}</td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 font-semibold">Plan</td>
              <td className="px-4 py-3">
                <CustomBadge {...getPlanLabel(tenant.billingPlan)} />
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 font-semibold">Statut</td>
              <td className="px-4 py-3 flex items-center gap-2">
                <CustomBadge {...getStatusLabel(status)} />
                <Button
                  className="cursor-pointer"
                  variant="outline"
                  size="sm"
                  onClick={toggleStatus}
                  disabled={isPending}
                >
                  {status === "ACTIVE" ? "Désactiver" : "Activer"}
                </Button>
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 font-semibold">ID Stripe</td>
              <td className="px-4 py-3">{tenant.stripeCustomerId || "-"}</td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 font-semibold">Créé le</td>
              <td className="px-4 py-3">
                {format(new Date(tenant.createdAt), "dd/MM/yyyy", {
                  locale: fr,
                })}
              </td>
            </tr>
            {director && (
              <>
                <tr className="border-b">
                  <td className="px-4 py-3 font-semibold">Directeur</td>
                  <td className="px-4 py-3">
                    {director.firstName} {director.lastName}
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-3 font-semibold">Email</td>
                  <td className="px-4 py-3">{director.email}</td>
                </tr>
                {director.phone && (
                  <tr className="border-b">
                    <td className="px-4 py-3 font-semibold">Téléphone</td>
                    <td className="px-4 py-3">{director.phone}</td>
                  </tr>
                )}
                {director.address && (
                  <tr>
                    <td className="px-4 py-3 font-semibold">Adresse</td>
                    <td className="px-4 py-3">{director.address}</td>
                  </tr>
                )}
              </>
            )}
          </tbody>
        </table>
      </div>

      {/* CARTE MOBILE */}
      <Card className="md:hidden p-4 space-y-2">
        <h2 className="text-lg font-semibold">{tenant.name}</h2>
        <p className="text-sm">N° École : {tenant.uniqueNumber || "-"}</p>
        <p className="text-sm">
          Plan : <CustomBadge {...getPlanLabel(tenant.billingPlan)} />
        </p>
        <p className="text-sm">
          Statut : <CustomBadge {...getStatusLabel(status)} />
        </p>
        <p className="text-sm">ID Stripe : {tenant.stripeCustomerId || "-"}</p>
        <p className="text-sm">
          Créé le :{" "}
          {format(new Date(tenant.createdAt), "dd/MM/yyyy", { locale: fr })}
        </p>
        {director && (
          <>
            <p className="text-sm">
              Directeur : {director.firstName} {director.lastName}
            </p>
            <p className="text-sm">Email : {director.email}</p>
            {director.phone && (
              <p className="text-sm">Téléphone : {director.phone}</p>
            )}
            {director.address && (
              <p className="text-sm">Adresse : {director.address}</p>
            )}
          </>
        )}
        <div className="flex gap-4 mt-2">
          <Button className="cursor-pointer" variant="destructive" size="sm">
            Résilier
          </Button>
          <Button className="cursor-pointer" variant="default" size="sm">
            Upgrade
          </Button>
        </div>
      </Card>
    </>
  );
}
