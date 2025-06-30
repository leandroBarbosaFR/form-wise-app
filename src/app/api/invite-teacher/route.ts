import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { resend } from "../../../lib/resend";
import { nanoid } from "nanoid";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/authOptions";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user || user.role !== "DIRECTOR") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const { email, firstName, lastName, phone } = await req.json();

  if (!email || !firstName || !lastName || !phone) {
    return NextResponse.json(
      { error: "Champs requis manquants" },
      { status: 400 }
    );
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: "Utilisateur déjà existant" },
      { status: 400 }
    );
  }

  const inviteToken = nanoid();

  try {
    await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        phone,
        password: null,
        role: "TEACHER",
        inviteToken,
        tenantId: user.tenantId,
      },
    });
  } catch (err) {
    console.error("❌ Erreur création user :", err);
    return NextResponse.json(
      { error: "Erreur lors de la création" },
      { status: 500 }
    );
  }

  await resend.emails.send({
    from: "Formwise <onboarding@formwise.fr>",
    to: [email],
    subject: "Invitation à rejoindre Formwise",
    html: `
      <p>Bonjour ${firstName},</p>
      <p>Vous avez été invité à rejoindre Formwise en tant que professeur.</p>
      <p><a href="https://formwise.fr/create-password?token=${inviteToken}">Cliquez ici pour activer votre compte</a></p>
    `,
  });

  return NextResponse.json({ success: true });
}
