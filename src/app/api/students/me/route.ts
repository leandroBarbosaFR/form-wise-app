// ✅ Multi-tenant filter added (tenantId)
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/authOptions";
import { prisma } from "../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  // Vérifier les permissions
  const allowedRoles = ["SUPER_ADMIN", "PARENT"];
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

  try {
    // Construction conditionnelle du filtre selon le rôle
    const whereClause =
      user.role === "SUPER_ADMIN"
        ? {
            parentId: user.id,
            status: "APPROVED",
          }
        : {
            parentId: user.id,
            tenantId: user.tenantId as string, // ✅ Filtrage multi-tenant
            status: "APPROVED",
          };

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
    console.error("Erreur API /students/me:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
