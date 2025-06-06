import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
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
  } = body;

  if (!firstName || !lastName || !birthDate || !address) {
    return NextResponse.json(
      { error: "Champs requis manquants" },
      { status: 400 }
    );
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
      parent: {
        connect: { email: session.user.email! },
      },
    },
  });

  return NextResponse.json({ success: true, student });
}
