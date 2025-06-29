// ✅ Multi-tenant filter added (tenantId)
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/authOptions";
import { prisma } from "../../../../lib/prisma";

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
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

  const { id } = await context.params;

  try {
    // Construction conditionnelle du filtre selon le rôle
    const whereClause =
      session.user.role === "SUPER_ADMIN"
        ? { id }
        : {
            id,
            tenantId: session.user.tenantId as string, // ✅ filtrage tenant
          };

    await prisma.schoolYear.deleteMany({
      where: whereClause,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'année :", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression" },
      { status: 500 }
    );
  }
}
