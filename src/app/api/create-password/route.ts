// ✅ Multi-tenant filter added (tenantId)
import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { token, password, classId, subjectId } = await req.json();
    console.log("🔐 Reçu dans create-password:", {
      token,
      password,
      classId,
      subjectId,
    });

    if (!token || !password) {
      return NextResponse.json(
        { success: false, error: "Champs requis manquants" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { inviteToken: token },
    });

    if (!user || user.role !== "TEACHER") {
      return NextResponse.json(
        { success: false, error: "Lien invalide ou expiré" },
        { status: 400 }
      );
    }

    if (user.password) {
      return NextResponse.json(
        { success: false, error: "Un compte existe déjà avec cet email" },
        { status: 400 }
      );
    }

    try {
      console.log("📥 Création teacher pour:", user.email);
      await prisma.teacher.create({
        data: {
          userId: user.id,
          classId: classId,
          subjectId: subjectId,
          tenantId: user.tenantId!, // ✅ assignation directe
        },
      });
      console.log("✅ Professeur ajouté à la table Teacher");
    } catch (err) {
      console.error("❌ Erreur lors de la création du teacher:", err);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        inviteToken: null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Erreur dans /api/create-password:", err);
    return NextResponse.json(
      { success: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
