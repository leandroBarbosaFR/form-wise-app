// ✅ Multi-tenant filter added (tenantId)
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../lib/authOptions";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "DIRECTOR") {
    return new NextResponse("Non autorisé", { status: 403 });
  }

  const { status } = await req.json();
  if (!["APPROVED", "REJECTED"].includes(status)) {
    return new NextResponse("Statut invalide", { status: 400 });
  }

  const { id } = await params;

  const student = await prisma.student.findUnique({
    where: { id },
  });

  if (!student || student.tenantId !== session.user.tenantId) {
    return new NextResponse("Élève introuvable ou non autorisé", {
      status: 404,
    });
  }

  const updatedStudent = await prisma.student.update({
    where: { id },
    data: { status },
  });

  return NextResponse.json(updatedStudent);
}
