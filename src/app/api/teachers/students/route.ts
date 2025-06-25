// ✅ Multi-tenant filter added (tenantId)
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/authOptions";
import { prisma } from "../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "TEACHER") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const teacher = await prisma.teacher.findFirst({
    where: {
      userId: session.user.id,
      tenantId: session.user.tenantId, // ✅ ajout ici aussi
    },
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
    where: {
      classId: teacher.classId,
      tenantId: session.user.tenantId, // ✅ important pour ne pas voir d’élèves d’autres écoles
    },
    include: { parent: true },
  });

  return NextResponse.json(students);
}
