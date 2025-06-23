import { prisma } from "../../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/authOptions";
import { redirect } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function TenantDetailPage({ params }: PageProps) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "SUPER_ADMIN") {
    redirect("/login");
  }

  const tenant = await prisma.tenant.findUnique({
    where: { id: params.id },
    include: {
      users: {
        where: { role: "DIRECTOR" },
        select: { firstName: true, lastName: true, email: true },
      },
    },
  });

  if (!tenant) {
    return <div className="p-6">École introuvable.</div>;
  }

  return (
    <div className="p-6 space-y-4">
      <Breadcrumb>
        <BreadcrumbItem>
          <BreadcrumbLink href="/admin/dashboard">Dashboard</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="#" aria-current="page">
            {tenant.name}
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      <h1 className="text-2xl font-semibold">{tenant.name}</h1>

      <p>
        <strong>N° École :</strong> {tenant.uniqueNumber}
      </p>
      <p>
        <strong>Plan :</strong> {tenant.billingPlan}
      </p>
      <p>
        <strong>Créé le :</strong>{" "}
        {new Date(tenant.createdAt).toLocaleDateString()}
      </p>

      {tenant.users.length > 0 && (
        <p>
          <strong>Directeur :</strong> {tenant.users[0].firstName}{" "}
          {tenant.users[0].lastName} ({tenant.users[0].email})
        </p>
      )}
    </div>
  );
}
