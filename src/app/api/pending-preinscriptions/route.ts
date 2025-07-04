// /api/pending-preinscriptions/route.ts
import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/authOptions";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "DIRECTOR" || !session.user.tenantId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tenantId = session.user.tenantId as string;

  const parents = await prisma.preRegistrationParent.findMany({
    where: { tenantId },
    include: {
      children: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          gender: true,
          desiredClass: true,
          status: true,
        },
      },
      documents: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(parents);
}
