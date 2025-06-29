// ✅ Multi-tenant filter added (tenantId)
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/authOptions";
import { prisma } from "../../../lib/prisma";

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
      ? {} // SUPER_ADMIN voit toutes les années scolaires
      : { tenantId: session.user.tenantId as string };

  const schoolYears = await prisma.schoolYear.findMany({
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

  return NextResponse.json({ schoolYears });
}

export async function POST(req: Request) {
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

  const body = await req.json();
  const { name, startDate, endDate, tenantId } = body;

  try {
    // Déterminer le tenantId à utiliser
    let targetTenantId: string;

    if (session.user.role === "SUPER_ADMIN") {
      // SUPER_ADMIN doit spécifier le tenantId dans le body
      if (!tenantId) {
        return NextResponse.json(
          { error: "tenantId requis pour les SUPER_ADMIN" },
          { status: 400 }
        );
      }
      targetTenantId = tenantId;
    } else {
      // DIRECTOR utilise son propre tenantId
      if (!session.user.tenantId) {
        return NextResponse.json(
          { error: "Utilisateur sans tenant" },
          { status: 403 }
        );
      }
      targetTenantId = session.user.tenantId;
    }

    const schoolYear = await prisma.schoolYear.create({
      data: {
        name,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        tenantId: targetTenantId, // ✅ assignation tenant
      },
    });

    return NextResponse.json({ success: true, schoolYear });
  } catch (error) {
    console.error("Erreur création année scolaire :", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
