// ✅ Multi-tenant filter added (tenantId) with SUPER_ADMIN support
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/authOptions";
import { prisma } from "../../../../lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  const session = await getServerSession(authOptions);

  if (!session) {
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

  const { id } = await params;

  try {
    // ✅ Construction conditionnelle de la clause where selon le rôle
    const whereClause =
      session.user.role === "SUPER_ADMIN"
        ? { id } // SUPER_ADMIN peut supprimer n'importe quelle classe
        : {
            id,
            tenantId: session.user.tenantId as string, // Safe car non-null pour DIRECTOR
          };

    const deleted = await prisma.class.deleteMany({
      where: whereClause,
    });

    if (deleted.count === 0) {
      return NextResponse.json(
        { error: "Classe non trouvée" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur suppression classe :", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
