// ✅ Multi-tenant filter added (tenantId)
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/authOptions";
import { prisma } from "../../../../lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "DIRECTOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tenantId = session.user.tenantId;
  const { title, message, teacherId } = await req.json();

  if (!title || !message || !teacherId) {
    return NextResponse.json(
      { error: "Champs requis manquants" },
      { status: 400 }
    );
  }

  try {
    const teacher = await prisma.teacher.findUnique({
      where: { id: teacherId },
      include: { user: true },
    });

    if (!teacher || !teacher.user || teacher.tenantId !== tenantId) {
      return NextResponse.json(
        { error: "Professeur introuvable ou accès interdit" },
        { status: 404 }
      );
    }

    const notification = await prisma.notification.create({
      data: {
        title,
        message,
        isGlobal: false,
        tenant: {
          connect: { id: tenantId },
        },
        teacher: {
          connect: { id: teacherId },
        },
      },
    });

    return NextResponse.json({ success: true, notification });
  } catch (error) {
    console.error("Erreur création notification prof:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
