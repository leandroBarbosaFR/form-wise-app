import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/authOptions";
import { prisma } from "../../../../lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "DIRECTOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: teacherId } = await params;

  try {
    await prisma.teacher.delete({
      where: { id: teacherId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur suppression professeur:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "DIRECTOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const { firstName, lastName, subjectId, classId } = body;

  try {
    const updatedTeacher = await prisma.teacher.update({
      where: { id },
      data: {
        subject: { connect: { id: subjectId } },
        class: { connect: { id: classId } },
        user: {
          update: {
            firstName,
            lastName,
          },
        },
      },
      include: {
        subject: true,
        class: true,
        user: true,
      },
    });

    return NextResponse.json({ success: true, teacher: updatedTeacher });
  } catch (error) {
    console.error("Erreur update teacher:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
