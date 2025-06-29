import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/authOptions";
import { prisma } from "../../../lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    // Vérifier les permissions
    const allowedRoles = ["SUPER_ADMIN", "PARENT"];
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

    const body = await req.json();
    const { studentId, url, fileName, fileType } = body;

    if (!studentId || !url || !fileName) {
      return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
    }

    // Construction conditionnelle de la requête selon le rôle
    let studentWhereClause;

    if (session.user.role === "SUPER_ADMIN") {
      // SUPER_ADMIN peut créer un document pour n'importe quel étudiant
      studentWhereClause = {
        id: studentId,
      };
    } else {
      // PARENT ne peut créer que pour ses enfants dans son tenant
      studentWhereClause = {
        id: studentId,
        parentId: session.user.id,
        tenantId: session.user.tenantId as string,
      };
    }

    const student = await prisma.student.findFirst({
      where: studentWhereClause,
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
