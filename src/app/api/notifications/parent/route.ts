// ✅ Multi-tenant filter added (tenantId)
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/authOptions";
import { prisma } from "../../../../lib/prisma";

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
        ? {} // SUPER_ADMIN voit tous les étudiants
        : { tenantId: session.user.tenantId as string };

    const students = await prisma.student.findMany({
      where: whereClause,
      select: {
        id: true,
        firstName: true,
        lastName: true,
      },
    });

    return NextResponse.json({ students });
  } catch (error) {
    console.error("Erreur lors de la récupération des élèves:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
