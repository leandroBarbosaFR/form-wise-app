import { prisma } from "../../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/authOptions";
import { redirect } from "next/navigation";

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Slash } from "lucide-react";
import TenantDetailCard from "../../../../components/TenantDetailCard";

// ✅ Interface correcte pour Next.js 15 - params est maintenant une Promise
interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function TenantDetailPage({ params }: PageProps) {
  // ✅ Récupération de la session
  const session = await getServerSession(authOptions);

  console.log("🧠 SESSION DEBUG:", session);

  if (!session) {
    console.warn("🔒 Aucune session trouvée → redirection login");
    redirect("/login");
  }

  if (session.user.role !== "SUPER_ADMIN") {
    console.warn("⛔ Accès refusé : rôle ≠ SUPER_ADMIN → redirection login");
    redirect("/login");
  }

  // ✅ Attendre la résolution des paramètres
  const { id } = await params;

  const tenant = await prisma.tenant.findUnique({
    where: { id },
    include: {
      users: {
        where: { role: "DIRECTOR" },
        select: {
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
        },
      },
    },
  });

  if (!tenant) {
    return <div className="p-6">❌ École introuvable.</div>;
  }

  const schoolName = tenant.name;

  return (
    <div className="p-6 space-y-4">
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <Slash className="h-4 w-4 text-muted-foreground" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink href="#" aria-current="page">
              {schoolName}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <TenantDetailCard tenant={tenant} />
    </div>
  );
}
