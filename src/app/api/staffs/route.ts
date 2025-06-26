// app/api/staffs/route.ts
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/authOptions";
import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "DIRECTOR") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const staff = await prisma.user.findMany({
    where: {
      tenantId: session.user.tenantId,
      role: "STAFF",
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
    },
  });

  return NextResponse.json({ staff });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "DIRECTOR") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const data = await req.json();
  const { email, firstName, lastName, phone } = data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return new NextResponse("Email déjà utilisé", { status: 409 });
  }

  const newUser = await prisma.user.create({
    data: {
      email,
      firstName,
      lastName,
      phone,
      role: "STAFF",
      tenantId: session.user.tenantId,
      inviteToken: crypto.randomUUID(),
    },
  });

  // (Optionnel) envoyer un email d'invitation ici

  return NextResponse.json({ user: newUser });
}
