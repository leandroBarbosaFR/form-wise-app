// ✅ Multi-tenant filter added (tenantId) with SUPER_ADMIN support
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../lib/authOptions";
import { prisma } from "../../../../../lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
      ? { user: { email: session.user.email! } } // SUPER_ADMIN peut marquer pour n'importe quel teacher
      : {
          user: { email: session.user.email! },
          tenantId: session.user.tenantId as string,
        };

  const teacher = await prisma.teacher.findFirst({
    where: teacherWhereClause,
  });

  if (!teacher) {
    return NextResponse.json(
      { error: "Professeur introuvable" },
      { status: 404 }
    );
  }

  try {
    const { id } = await params;

    await prisma.notificationReadTeacher.upsert({
      where: {
        notificationId_teacherId: {
          notificationId: id,
          teacherId: teacher.id,
        },
      },
      update: {
        readAt: new Date(),
      },
      create: {
        notificationId: id,
        teacherId: teacher.id,
        readAt: new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur marquage lu :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
