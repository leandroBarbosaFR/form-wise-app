// app/api/teachers/[id]/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "../../../../lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "DIRECTOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const teacherId = params.id;

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
