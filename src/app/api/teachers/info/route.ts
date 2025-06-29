// ✅ Multi-tenant filter added (tenantId)
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/authOptions";
import { prisma } from "../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  // Vérifier les permissions
  const allowedRoles = ["SUPER_ADMIN", "TEACHER"];
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
  const teacherWhereClause =
    session.user.role === "SUPER_ADMIN"
      ? { userId: session.user.id }
      : {
          userId: session.user.id, // ✅ corrige la recherche
          tenantId: session.user.tenantId as string, // ✅ multi-tenant
        };

  const teacher = await prisma.teacher.findFirst({
    where: teacherWhereClause,
    include: {
      class: true,
      subject: true,
    },
  });

  if (!teacher) {
    return NextResponse.json({ error: "Non trouvé" }, { status: 404 });
  }

  return NextResponse.json({
    className: teacher.class?.name,
    subjectName: teacher.subject?.name,
  });
}
