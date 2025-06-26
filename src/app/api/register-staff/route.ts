import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password, schoolCode } = body;

  if (!email || !password || !schoolCode) {
    return NextResponse.json({ error: "Données manquantes" }, { status: 400 });
  }

  // Cherche dans la table Staff si une invitation existe
  const staff = await prisma.staff.findFirst({
    where: {
      email,
      schoolCode,
      used: false,
      accepted: false,
    },
    include: {
      tenant: true,
    },
  });

  if (!staff) {
    return NextResponse.json(
      { error: "Lien invalide ou déjà utilisé." },
      { status: 401 }
    );
  }

  // Vérifie si un user existe déjà avec cet email
  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    return NextResponse.json(
      { error: "Un compte existe déjà avec cet email." },
      { status: 400 }
    );
  }

  // Hash du mot de passe
  const hashedPassword = await bcrypt.hash(password, 10);

  // Création du user
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role: "STAFF",
      firstName: staff.firstName,
      lastName: staff.lastName,
      phone: staff.phone,
      tenantId: staff.tenantId,
    },
  });

  // Mise à jour de l'entrée Staff pour marquer comme utilisé
  await prisma.staff.update({
    where: { id: staff.id },
    data: {
      accepted: true,
      used: true,
      validatedAt: new Date(),
      userId: user.id,
    },
  });

  return NextResponse.json({ success: true });
}
