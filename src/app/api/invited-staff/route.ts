// /app/api/invited-staff/route.ts
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/authOptions";
import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  // Vérifier les permissions
  const allowedRoles = ["SUPER_ADMIN", "DIRECTOR"];
  if (!allowedRoles.includes(session.user.role)) {
    return NextResponse.json(
      { error: "Permissions insuffisantes" },
      { status: 403 }
    );
  }

  // Vérifier que les non-SUPER_ADMIN ont un tenantId
  if (session.user.role !== "SUPER_ADMIN" && !session.user.tenantId) {
    return NextResponse.json(
      { error: "Utilisateur sans tenant" },
      { status: 403 }
    );
  }

  // Construction conditionnelle du filtre selon le rôle
  const whereClause =
    session.user.role === "SUPER_ADMIN"
      ? {} // SUPER_ADMIN voit tout le staff de tous les tenants
      : { tenantId: session.user.tenantId as string };

  const staff = await prisma.staff.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
    // Inclure les infos du tenant pour SUPER_ADMIN
    ...(session.user.role === "SUPER_ADMIN" && {
      include: {
        tenant: {
          select: {
            id: true,
            name: true,
            schoolCode: true,
          },
        },
      },
    }),
  });

  return NextResponse.json({ staff });
}
