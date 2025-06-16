import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import bcrypt from "bcryptjs";
import { resend } from "../../../lib/resend";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("📦 Données reçues /api/register:", body);
    const { email, password, firstName, lastName, phone } = body;
    const role = "PARENT";

    if (
      !email?.trim() ||
      !password?.trim() ||
      !firstName?.trim() ||
      !lastName?.trim() ||
      !phone?.trim() ||
      !role
    ) {
      return NextResponse.json(
        { success: false, error: "Champs manquants ou invalides" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "Cet email est déjà utilisé." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone,
        role,
      },
    });

    // 👇 Envoi de l'email de bienvenue avec lien de login
    await resend.emails.send({
      from: "Formwise <onboarding@formwise.fr>",
      to: [email],
      subject: "Bienvenue sur Formwise !",
      html: `
        <p>Bonjour ${firstName},</p>
        <p>Votre compte a été créé avec succès.</p>
        <p><a href="https://formwise.fr/login?email=${encodeURIComponent(email)}">Cliquez ici pour vous connecter</a></p>
        <p>À bientôt !</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Erreur dans /api/register :", error);
    return NextResponse.json(
      { success: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
