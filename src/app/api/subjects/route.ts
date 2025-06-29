// ✅ Multi-tenant filter added (tenantId)
import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/authOptions";

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
  const { name, classId, tenantId } = body;

  if (!name || !classId) {
    return NextResponse.json(
      { error: "Champs requis manquants" },
      { status: 400 }
    );
  }

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

    const subject = await prisma.subject.create({
      data: {
        name,
        classId,
        tenantId: targetTenantId, // ✅ assign tenant
      },
    });
    return NextResponse.json({ success: true, subject });
  } catch (error) {
    console.error("Erreur création matière :", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}

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
      ? {} // SUPER_ADMIN voit toutes les matières
      : { tenantId: session.user.tenantId as string };

  const subjects = await prisma.subject.findMany({
    where: whereClause,
    include: {
      class: true,
      teachers: {
        take: 1,
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      },
      // Inclure les infos du tenant pour SUPER_ADMIN
      ...(session.user.role === "SUPER_ADMIN" && {
        tenant: {
          select: {
            id: true,
            name: true,
            schoolCode: true,
          },
        },
      }),
    },
  });

  return NextResponse.json({ subjects });
}
