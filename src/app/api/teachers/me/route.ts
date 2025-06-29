// ✅ Multi-tenant filter added (tenantId)
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/authOptions";
import { prisma } from "../../../../lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  // Vérifier les permissions
  const allowedRoles = ["SUPER_ADMIN", "TEACHER"];
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

  // Construction conditionnelle du filtre selon le rôle
  const teacherWhereClause =
    user.role === "SUPER_ADMIN"
      ? { userId: user.id }
      : {
          userId: user.id,
          tenantId: user.tenantId as string, // ✅ filtration multi-tenant
        };

  const teacher = await prisma.teacher.findFirst({
    where: teacherWhereClause,
    include: {
      class: true,
      subject: true,
      user: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
        },
      },
    },
  });

  if (!teacher) {
    return NextResponse.json(
      { error: "Professeur introuvable" },
      { status: 404 }
    );
  }

  return NextResponse.json({ teacher });
}
