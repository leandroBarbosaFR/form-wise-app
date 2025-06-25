// ✅ Crée une école avec code unique
import { prisma } from "../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/authOptions";
import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const body = await req.json();
  const { name, email, password, phone, firstName, lastName, address } = body;

  if (!name || !email || !password || !firstName || !lastName) {
    return NextResponse.json(
      { error: "Champs requis manquants" },
      { status: 400 }
    );
  }

  // Générer un code école unique (6 caractères majuscules)
  const schoolCode = nanoid(6).toUpperCase();

  try {
    // Créer le tenant
    const tenant = await prisma.tenant.create({
      data: {
        name,
        schoolCode,
      },
    });

    // Créer le directeur lié à ce tenant
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: "DIRECTOR",
        tenantId: tenant.id,
        phone,
        firstName,
        lastName,
        address,
      },
    });

    return NextResponse.json({ success: true, tenant });
  } catch (err) {
    console.error("Erreur création tenant :", err);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
