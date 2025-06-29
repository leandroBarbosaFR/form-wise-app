// ✅ Multi-tenant filter added (tenantId)
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../lib/authOptions";
import { prisma } from "../../../../../lib/prisma";

export async function POST(req: Request) {
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

  const { notificationId } = await req.json();
  const email = session.user.email;

  // Construction conditionnelle du filtre selon le rôle
  const teacherWhereClause =
    session.user.role === "SUPER_ADMIN"
      ? { user: { email } }
      : {
          user: { email },
          tenantId: session.user.tenantId as string,
        };

  const teacher = await prisma.teacher.findFirst({
    where: teacherWhereClause,
  });

  if (!teacher) {
    return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
  }

  const existing = await prisma.notificationReadTeacher.findFirst({
    where: {
      notificationId,
      teacherId: teacher.id,
    },
  });

  if (!existing) {
    await prisma.notificationReadTeacher.create({
      data: {
        notificationId,
        teacherId: teacher.id,
        readAt: new Date(),
      },
    });
  }

  return NextResponse.json({ success: true });
}
