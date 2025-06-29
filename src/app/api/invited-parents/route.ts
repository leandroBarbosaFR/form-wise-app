// /api/invited-parents/route.ts
import { prisma } from "../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/authOptions";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  // Vérifier les permissions
  const allowedRoles = ["SUPER_ADMIN", "DIRECTOR"];
  if (!allowedRoles.includes(user.role)) {
    return NextResponse.json(
      { error: "Permissions insuffisantes" },
      { status: 403 }
    );
  }

  // Vérifier que les non-SUPER_ADMIN ont un tenantId
  if (user.role !== "SUPER_ADMIN" && !user.tenantId) {
    return NextResponse.json(
      { error: "Utilisateur sans tenant" },
      { status: 403 }
    );
  }

  // Construction conditionnelle du filtre selon le rôle
  const whereClause =
    user.role === "SUPER_ADMIN"
      ? {} // SUPER_ADMIN voit toutes les invitations
      : { tenantId: user.tenantId as string };

  const invited = await prisma.invitedParent.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
    include: {
      tenant:
        user.role === "SUPER_ADMIN"
          ? {
              select: {
                id: true,
                name: true,
                schoolCode: true,
              },
            }
          : false,
    },
  });

  // Cherche les users correspondant aux emails
  const emails = invited.map((p) => p.email);

  // Construction conditionnelle du filtre pour les users
  const userWhereClause =
    user.role === "SUPER_ADMIN"
      ? { email: { in: emails } } // SUPER_ADMIN voit tous les users
      : {
          email: { in: emails },
          tenantId: user.tenantId as string,
        };

  const users = await prisma.user.findMany({
    where: userWhereClause,
    select: {
      email: true,
      firstName: true,
      // Inclure tenantId pour SUPER_ADMIN pour faire le matching
      ...(user.role === "SUPER_ADMIN" && { tenantId: true }),
    },
  });

  // Fusionne les infos
  const enriched = invited.map((inv) => {
    const matched = users.find((u) => {
      if (user.role === "SUPER_ADMIN") {
        // Pour SUPER_ADMIN, on match par email ET tenantId
        const userWithTenant = u as typeof u & { tenantId?: string | null };
        return (
          u.email === inv.email && userWithTenant.tenantId === inv.tenantId
        );
      } else {
        // Pour DIRECTOR, on match juste par email (même tenant garanti)
        return u.email === inv.email;
      }
    });

    return {
      ...inv,
      firstName: matched?.firstName ?? null,
    };
  });

  return NextResponse.json(enriched);
}
