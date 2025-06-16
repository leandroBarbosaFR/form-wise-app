import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();
    console.log("🔐 Reçu dans create-password:", { token, password });

    if (!token || !password) {
      return NextResponse.json(
        { success: false, error: "Token ou mot de passe manquant" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { inviteToken: token },
    });
    console.log("🔍 Résultat recherche user :", user);

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
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
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
        inviteToken: null, // On nettoie le token une fois utilisé
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
