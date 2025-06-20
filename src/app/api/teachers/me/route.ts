import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/authOptions";
import { prisma } from "../../../../lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user || user.role !== "TEACHER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const teacher = await prisma.teacher.findUnique({
    where: { userId: user.id },
    include: {
      class: true,
      subject: true,
      user: true,
    },
  });
  console.log("Teacher ===>", teacher);

  if (!teacher) {
    return NextResponse.json(
      { error: "Professeur introuvable" },
      { status: 404 }
    );
  }

  return NextResponse.json({ teacher });
}
