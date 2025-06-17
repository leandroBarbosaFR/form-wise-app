import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/authOptions";
import { prisma } from "../../../lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  console.log("SESSION:", session);

  if (!session || session.user.role !== "PARENT") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const students = await prisma.student.findMany({
    where: {
      parent: {
        email: session.user.email!,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json({ students });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "PARENT") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const {
    firstName,
    lastName,
    birthDate,
    address,
    hasHealthIssues,
    healthDetails,
    canLeaveAlone,
    classId,
  } = body;

  if (!firstName || !lastName || !birthDate || !address || !classId) {
    return NextResponse.json(
      { error: "Champs requis manquants" },
      { status: 400 }
    );
  }

  const targetClass = await prisma.class.findUnique({
    where: { id: classId },
  });

  if (!targetClass) {
    return NextResponse.json({ error: "Classe introuvable" }, { status: 404 });
  }

  const student = await prisma.student.create({
    data: {
      firstName,
      lastName,
      birthDate: new Date(birthDate),
      address,
      hasHealthIssues,
      healthDetails: hasHealthIssues ? healthDetails : null,
      canLeaveAlone,
      status: "PENDING",
      parent: {
        connect: { email: session.user.email! },
      },
      class: {
        connect: { id: classId },
      },
    },
  });

  return NextResponse.json({ success: true, student });
}
