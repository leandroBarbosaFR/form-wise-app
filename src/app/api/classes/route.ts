// ✅ Multi-tenant filter added (tenantId) with SUPER_ADMIN support
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/authOptions";
import { prisma } from "../../../../src/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  // Vérifier les permissions pour créer une classe
  const allowedRoles = ["SUPER_ADMIN", "DIRECTOR"];
  if (!allowedRoles.includes(session.user.role)) {
    return NextResponse.json(
      { error: "Permissions insuffisantes" },
      { status: 403 }
    );
  }

  const { name, monthlyFee, schoolYearId, tenantId } = await req.json();

  try {
    // Construction des données selon le rôle
    let classData;

    if (session.user.role === "SUPER_ADMIN") {
      // SUPER_ADMIN doit spécifier le tenantId dans le body
      if (!tenantId) {
        return NextResponse.json(
          {
            error: "tenantId requis pour les SUPER_ADMIN",
          },
          { status: 400 }
        );
      }

      classData = {
        name,
        monthlyFee,
        schoolYear: { connect: { id: schoolYearId } },
        tenant: { connect: { id: tenantId } },
      };
    } else {
      // DIRECTOR utilise son propre tenantId
      if (!session.user.tenantId) {
        return NextResponse.json(
          {
            error: "Utilisateur sans tenant",
          },
          { status: 403 }
        );
      }

      classData = {
        name,
        monthlyFee,
        schoolYear: { connect: { id: schoolYearId } },
        tenant: { connect: { id: session.user.tenantId } },
      };
    }

    const newClass = await prisma.class.create({
      data: classData,
    });

    return NextResponse.json({ success: true, class: newClass });
  } catch (error) {
    console.error("Erreur création classe :", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  // Vérifier les permissions pour lire les classes
  const allowedRoles = ["SUPER_ADMIN", "DIRECTOR", "TEACHER", "STAFF"];
  if (!allowedRoles.includes(session.user.role)) {
    return NextResponse.json(
      { error: "Permissions insuffisantes" },
      { status: 403 }
    );
  }

  try {
    // Construction du filtre selon le rôle
    const whereClause =
      session.user.role === "SUPER_ADMIN"
        ? {} // SUPER_ADMIN voit toutes les classes
        : { tenantId: session.user.tenantId as string }; // Filtre par tenant

    const classes = await prisma.class.findMany({
      where: whereClause,
      include: {
        schoolYear: true,
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
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ classes });
  } catch (error) {
    console.error("Erreur récupération classes :", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
