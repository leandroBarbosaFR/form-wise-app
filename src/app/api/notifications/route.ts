import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/authOptions";
import { prisma } from "../../../lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "DIRECTOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { title, message, isGlobal, studentId } = body;

  if (!title || title.trim() === "") {
    return NextResponse.json({ error: "Titre requis" }, { status: 400 });
  }

  if (!message || message.trim() === "") {
    return NextResponse.json({ error: "Message requis" }, { status: 400 });
  }

  try {
    const notification = await prisma.notification.create({
      data: {
        title,
        message,
        isGlobal,
        studentId: isGlobal ? null : studentId || null,
      },
    });

    return NextResponse.json({ success: true, notification });
  } catch (error) {
    console.error("Erreur création notification :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const role = session.user.role;
  const email = session.user.email!;

  try {
    if (role === "DIRECTOR") {
      const notifications = await prisma.notification.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          student: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
          readBy: true,
        },
      });

      return NextResponse.json({ notifications });
    }

    if (role === "PARENT") {
      const parent = await prisma.user.findUnique({
        where: { email },
        include: {
          students: true,
        },
      });

      const studentIds = parent?.students.map((s) => s.id) || [];

      const notifications = await prisma.notification.findMany({
        where: {
          OR: [{ isGlobal: true }, { studentId: { in: studentIds } }],
        },
        orderBy: { createdAt: "desc" },
        include: {
          student: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
          readBy: true,
        },
      });

      return NextResponse.json({ notifications });
    }

    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  } catch (error) {
    console.error("Erreur récupération notifications :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
