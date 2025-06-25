// ✅ Multi-tenant filter added (tenantId)
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

  if (!session || session.user.role !== "TEACHER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tenantId = session.user.tenantId;

  const teacher = await prisma.teacher.findFirst({
    where: {
      user: { email: session.user.email! },
      tenantId,
    },
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
