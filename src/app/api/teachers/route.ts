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

  try {
    // Construction conditionnelle du filtre selon le rôle
    const whereClause =
      session.user.role === "SUPER_ADMIN"
        ? {} // SUPER_ADMIN voit tous les enseignants
        : { tenantId: session.user.tenantId as string };

    const teachers = await prisma.teacher.findMany({
      where: whereClause,
      include: {
        subject: true,
        class: true,
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
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

    console.log("Professeurs trouvés:", teachers);
    return NextResponse.json({ teachers });
  } catch (error) {
    console.error("Erreur récupération enseignants :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
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
  const { subjectId, classId, userId, tenantId } = body;

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

    const teacher = await prisma.teacher.create({
      data: {
        userId,
        tenant: { connect: { id: targetTenantId } },
        subject: { connect: { id: subjectId } },
        class: { connect: { id: classId } },
      },
    });

    return NextResponse.json({ success: true, teacher });
  } catch (error) {
    console.error("Erreur création professeur :", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
