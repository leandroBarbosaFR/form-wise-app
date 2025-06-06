// api/subjects/route.ts
import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

// POST /api/subjects
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "DIRECTOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { name, classId } = body;

  if (!name || !classId) {
    return NextResponse.json(
      { error: "Champs requis manquants" },
      { status: 400 }
    );
  }

  try {
    const subject = await prisma.subject.create({
      data: {
        name,
        classId,
      },
    });
    return NextResponse.json({ success: true, subject });
  } catch (error) {
    console.error("Erreur création matière :", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}

// GET /api/subjects
export async function GET() {
  const subjects = await prisma.subject.findMany({
    include: {
      class: true,
    },
  });
  return NextResponse.json({ subjects });
}
