import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/authOptions";
import { prisma } from "../../../lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "PARENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { studentId, url, fileName, fileType } = body;

    if (!studentId || !url || !fileName) {
      return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
    }

    const student = await prisma.student.findFirst({
      where: {
        id: studentId,
        parentId: session.user.id,
        tenantId: session.user.tenantId,
      },
    });

    if (!student) {
      return NextResponse.json(
        { error: "Élève introuvable ou accès interdit" },
        { status: 403 }
      );
    }

    const document = await prisma.document.create({
      data: {
        studentId,
        url,
        fileName,
        fileType,
      },
    });

    return NextResponse.json({ document }, { status: 201 });
  } catch (error) {
    console.error("Erreur API /api/documents:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
