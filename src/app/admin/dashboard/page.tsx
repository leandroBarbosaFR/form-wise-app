import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/authOptions";
import { redirect } from "next/navigation";
import { prisma } from "../../../lib/prisma";
import { Badge } from "@/components/ui/badge";

function getPlanBadge(plan: string) {
  switch (plan) {
    case "FREE_TRIAL":
      return <Badge className="bg-yellow-500 text-white">Essai gratuit</Badge>;
    case "MONTHLY":
      return <Badge className="bg-green-600 text-white">Mensuel</Badge>;
    case "YEARLY":
      return <Badge className="bg-blue-600 text-white">Annuel</Badge>;
    default:
      return <Badge className="bg-gray-400 text-white">Inconnu</Badge>;
  }
}

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "SUPER_ADMIN") {
    redirect("/login");
  }

  const tenants = await prisma.tenant.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      users: {
        where: { role: "DIRECTOR" },
        select: { email: true, firstName: true, lastName: true },
      },
    },
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Dashboard Admin – Écoles</h1>

      {/* TABLEAU DESKTOP */}
      <div className="hidden md:block overflow-auto rounded-lg border">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700 font-semibold">
            <tr>
              <th className="px-4 py-3">N° École</th>
              <th className="px-4 py-3">Nom</th>
              <th className="px-4 py-3">Directeur</th>
              <th className="px-4 py-3">Plan</th>
              <th className="px-4 py-3">Créé le</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {tenants.map((tenant) => (
              <tr key={tenant.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-600 font-medium">
                  {tenant.uniqueNumber}
                </td>
                <td className="px-4 py-3">{tenant.name}</td>
                <td className="px-4 py-3">
                  {tenant.users.length > 0 ? (
                    <>
                      {tenant.users[0].firstName} {tenant.users[0].lastName}
                      <br />
                      <span className="text-xs text-gray-500">
                        {tenant.users[0].email}
                      </span>
                    </>
                  ) : (
                    <em className="text-gray-400">Non défini</em>
                  )}
                </td>
                <td className="px-4 py-3">
                  {getPlanBadge(tenant.billingPlan)}
                </td>
                <td className="px-4 py-3">
                  {new Date(tenant.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-right">
                  <a
                    href={`/admin/tenant/${tenant.id}`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Voir
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CARTES MOBILE */}
      <div className="md:hidden flex flex-col gap-4">
        {tenants.map((tenant) => (
          <div
            key={tenant.id}
            className="border rounded-xl p-4 shadow bg-white"
          >
            <div className="text-sm text-gray-500 mb-1">
              N° École : <strong>{tenant.uniqueNumber}</strong>
            </div>
            <div className="text-lg font-bold">{tenant.name}</div>
            <div className="text-sm mb-1">
              Directeur :{" "}
              {tenant.users.length > 0 ? (
                <>
                  {tenant.users[0].firstName} {tenant.users[0].lastName}
                  <br />
                  <span className="text-xs text-gray-500">
                    {tenant.users[0].email}
                  </span>
                </>
              ) : (
                <em className="text-gray-400">Non défini</em>
              )}
            </div>
            <div className="text-sm flex items-center gap-2 mb-1">
              Plan : {getPlanBadge(tenant.billingPlan)}
            </div>
            <div className="text-sm text-gray-600 mb-2">
              Créé le : {new Date(tenant.createdAt).toLocaleDateString()}
            </div>
            <div className="text-right">
              <a
                href={`/admin/tenant/${tenant.id}`}
                className="text-sm text-blue-600 hover:underline"
              >
                Voir les détails →
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
