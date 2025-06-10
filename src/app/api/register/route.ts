import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password, firstName, lastName, phone, role } = body;

  if (!email || !password || !firstName || !lastName || !phone || !role) {
    return NextResponse.json(
      { success: false, error: "Champs manquants" },
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

  return NextResponse.json({ success: true });
}
