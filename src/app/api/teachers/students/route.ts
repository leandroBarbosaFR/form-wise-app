import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/authOptions";
import { prisma } from "../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "TEACHER") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const teacher = await prisma.teacher.findUnique({
    where: { userId: session.user.id },
    include: {
      class: true,
      subject: true,
      user: true,
    },
  });

  if (!teacher?.classId) {
    return NextResponse.json([], { status: 200 });
  }

  const students = await prisma.student.findMany({
    where: { classId: teacher.classId },
    include: { parent: true },
  });

  return NextResponse.json(students);
}
