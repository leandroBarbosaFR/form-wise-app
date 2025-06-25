// ✅ Multi-tenant filter added (tenantId)
import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/authOptions";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "DIRECTOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { name, classId } = body;

  if (!name || !classId) {
    return NextResponse.json(
      { error: "Champs requis manquants" },
      { status: 400 }
    );
  }

  try {
    const subject = await prisma.subject.create({
      data: {
        name,
        classId,
        tenantId: session.user.tenantId, // ✅ assign tenant
      },
    });
    return NextResponse.json({ success: true, subject });
  } catch (error) {
    console.error("Erreur création matière :", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "DIRECTOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const subjects = await prisma.subject.findMany({
    where: {
      tenantId: session.user.tenantId, // ✅ filtrage tenant
    },
    include: {
      class: true,
      teachers: {
        take: 1,
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      },
    },
  });

  return NextResponse.json({ subjects });
}
