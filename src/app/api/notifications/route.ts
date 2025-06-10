import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "../../../lib/prisma";

// POST /api/notifications
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

// GET /api/notifications
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "DIRECTOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const notifications = await prisma.notification.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        student: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        readBy: true, // pour savoir combien de parents ont lu
      },
    });

    return NextResponse.json({ notifications });
  } catch (error) {
    console.error("Erreur récupération notifications :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
