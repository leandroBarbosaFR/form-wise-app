// ✅ Multi-tenant filter added (tenantId) with SUPER_ADMIN support
import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/authOptions";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  // Vérifier que l'utilisateur a les permissions appropriées
  if (session.user.role !== "SUPER_ADMIN" && !session.user.tenantId) {
    return NextResponse.json({ error: "Accès non autorisé" }, { status: 403 });
  }

  try {
    // ✅ Construction conditionnelle du filtre selon le rôle
    const whereClause =
      session.user.role === "SUPER_ADMIN"
        ? {} // SUPER_ADMIN voit toutes les classes de tous les tenants
        : { tenantId: session.user.tenantId as string }; // Filtre par tenant pour les autres rôles

    const classes = await prisma.class.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        monthlyFee: true,
        // Ajouter tenantId dans le select si SUPER_ADMIN pour identifier l'origine
        ...(session.user.role === "SUPER_ADMIN" && {
          tenantId: true,
          tenant: {
            select: {
              name: true,
              schoolCode: true,
            },
          },
        }),
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ classes });
  } catch (error) {
    console.error("Erreur récupération des classes publiques :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
