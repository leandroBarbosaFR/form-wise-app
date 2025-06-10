import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "../../../../lib/prisma";

// GET /api/students/all
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "DIRECTOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const students = await prisma.student.findMany({
    select: {
      id: true,
      firstName: true,
      lastName: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ students });
}
