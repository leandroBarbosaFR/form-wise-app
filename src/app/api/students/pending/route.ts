import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/authOptions";
import { prisma } from "../../../../lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "DIRECTOR") {
    return new NextResponse("Non autorisé", { status: 403 });
  }

  const pendingStudents = await prisma.student.findMany({
    where: { status: "PENDING" },
    include: {
      parent: { select: { firstName: true, lastName: true, email: true } },
    },
  });

  return NextResponse.json(pendingStudents);
}
