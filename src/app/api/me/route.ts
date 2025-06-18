import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/authOptions";
import { prisma } from "../../../lib/prisma";

// GET /api/me → retourne les infos de l'utilisateur connecté
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      role: true,
    },
  });

  return NextResponse.json({ user });
}

// PUT /api/me → met à jour firstName, lastName, phone
export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { firstName, lastName, phone } = await req.json();

  if (!firstName || !lastName) {
    return NextResponse.json(
      { error: "Prénom et nom requis" },
      { status: 400 }
    );
  }

  const updated = await prisma.user.update({
    where: { email: session.user.email! },
    data: {
      firstName,
      lastName,
      phone,
    },
  });

  return NextResponse.json({ success: true, user: updated });
}
