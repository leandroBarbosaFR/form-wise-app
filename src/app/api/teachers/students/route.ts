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
          userId: session.user.id,
          tenantId: session.user.tenantId as string, // ✅ ajout ici aussi
        };

  const teacher = await prisma.teacher.findFirst({
    where: teacherWhereClause,
    include: {
      class: true,
      subject: true,
      user: true,
    },
  });

  if (!teacher?.classId) {
    return NextResponse.json([], { status: 200 });
  }

  // Construction conditionnelle du filtre pour les étudiants
  const studentsWhereClause =
    session.user.role === "SUPER_ADMIN"
      ? { classId: teacher.classId }
      : {
          classId: teacher.classId,
          tenantId: session.user.tenantId as string, // ✅ important pour ne pas voir d'élèves d'autres écoles
        };

  const students = await prisma.student.findMany({
    where: studentsWhereClause,
    include: { parent: true },
  });

  return NextResponse.json(students);
}
