import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/authOptions";
import { prisma } from "../../../lib/prisma";

export async function GET() {
  try {
    const teachers = await prisma.teacher.findMany({
      include: {
        subject: true,
        class: true,
      },
    });

    console.log("📦 Professeurs trouvés:", teachers);
    return NextResponse.json({ teachers });
  } catch (error) {
    console.error("Erreur récupération enseignants :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "DIRECTOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { firstName, lastName, subjectId, classId, email } = body;

  try {
    const teacher = await prisma.teacher.create({
      data: {
        firstName,
        lastName,
        email,
        subject: { connect: { id: subjectId } },
        class: { connect: { id: classId } },
      },
      include: {
        subject: true,
        class: true,
      },
    });

    return NextResponse.json({ success: true, teacher });
  } catch (error) {
    console.error("Erreur création professeur :", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
