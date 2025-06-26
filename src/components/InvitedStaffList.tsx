"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserCheck, Clock } from "lucide-react";
import EmptyState from "./EmptyState";

export type InvitedStaff = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  roleLabel: string;
  createdAt: string;
  accepted: boolean;
};

type InvitedStaffListProps = {
  staffList: InvitedStaff[];
  setStaffList: React.Dispatch<React.SetStateAction<InvitedStaff[]>>;
};

export default function InvitedStaffList({ staffList }: InvitedStaffListProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (staffList.length === 0) {
    return (
      <EmptyState
        message="Aucun staff invité pour le moment."
        actionLabel="Inviter un staff"
        onAction={() => console.log("Inviter un staff")}
      />
    );
  }

  const renderBadge = (accepted: boolean) =>
    accepted ? (
      <Badge variant="default" className="flex items-center gap-1">
        <UserCheck className="w-4 h-4" /> Validé
      </Badge>
    ) : (
      <Badge variant="outline" className="flex items-center gap-1">
        <Clock className="w-4 h-4" /> En attente
      </Badge>
    );

  if (isMobile) {
    return (
      <div className="grid gap-4">
        {staffList.map((staff) => (
          <Card key={staff.id}>
            <CardContent className="p-4 space-y-2">
              <div className="font-semibold">
                {staff.firstName} {staff.lastName}
              </div>
              <div className="text-sm text-muted-foreground">
                {staff.roleLabel}
              </div>
              <div className="text-sm text-muted-foreground">{staff.email}</div>
              <div className="text-sm text-muted-foreground">{staff.phone}</div>
              {renderBadge(staff.accepted)}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-md border shadow-sm">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 dark:bg-zinc-800">
          <tr className="text-left text-gray-500 dark:text-gray-300 uppercase text-xs">
            <th className="px-4 py-3">Nom</th>
            <th className="px-4 py-3">Fonction</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Téléphone</th>
            <th className="px-4 py-3">Statut</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-zinc-700">
          {staffList.map((staff) => (
            <tr
              key={staff.id}
              className="hover:bg-gray-50 dark:hover:bg-zinc-700"
            >
              <td className="px-4 py-3 font-medium text-black dark:text-white">
                {staff.firstName} {staff.lastName}
              </td>
              <td className="px-4 py-3">{staff.roleLabel}</td>
              <td className="px-4 py-3">{staff.email}</td>
              <td className="px-4 py-3">{staff.phone}</td>
              <td className="px-4 py-3">{renderBadge(staff.accepted)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
