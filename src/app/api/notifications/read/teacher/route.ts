// ✅ Multi-tenant filter added (tenantId)
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../lib/authOptions";
import { prisma } from "../../../../../lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "TEACHER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tenantId = session.user.tenantId;
  const { notificationId } = await req.json();
  const email = session.user.email;

  const teacher = await prisma.teacher.findFirst({
    where: {
      user: { email },
      tenantId,
    },
  });

  if (!teacher) {
    return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
  }

  const existing = await prisma.notificationReadTeacher.findFirst({
    where: {
      notificationId,
      teacherId: teacher.id,
    },
  });

  if (!existing) {
    await prisma.notificationReadTeacher.create({
      data: {
        notificationId,
        teacherId: teacher.id,
        readAt: new Date(),
      },
    });
  }

  return NextResponse.json({ success: true });
}
