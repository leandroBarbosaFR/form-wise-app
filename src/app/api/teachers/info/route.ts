import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/authOptions";
import { prisma } from "../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "TEACHER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const teacher = await prisma.teacher.findUnique({
    where: { id: session.user.id },
    include: {
      class: true,
      subject: true,
    },
  });

  if (!teacher) {
    return NextResponse.json({ error: "Non trouvé" }, { status: 404 });
  }

  return NextResponse.json({
    className: teacher.class?.name,
    subjectName: teacher.subject?.name,
  });
}
