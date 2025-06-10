import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/authOptions";

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "PARENT") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { id: studentId } = await context.params;

  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: { parent: true },
  });

  if (!student || student.parent.email !== session.user.email) {
    return NextResponse.json(
      { error: "Élève non trouvé ou non autorisé" },
      { status: 404 }
    );
  }

  await prisma.student.delete({ where: { id: studentId } });

  return NextResponse.json({ success: true });
}
