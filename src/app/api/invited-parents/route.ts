// /api/invited-parents/route.ts
import { prisma } from "../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/authOptions";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user || user.role !== "DIRECTOR") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const invited = await prisma.invitedParent.findMany({
    where: { tenantId: user.tenantId },
    orderBy: { createdAt: "desc" },
    include: {
      tenant: false,
    },
  });

  // Cherche les users correspondant aux emails
  const emails = invited.map((p) => p.email);
  const users = await prisma.user.findMany({
    where: {
      email: { in: emails },
      tenantId: user.tenantId,
    },
    select: {
      email: true,
      firstName: true,
    },
  });

  // Fusionne les infos
  const enriched = invited.map((inv) => {
    const matched = users.find((u) => u.email === inv.email);
    return {
      ...inv,
      firstName: matched?.firstName ?? null,
    };
  });

  return NextResponse.json(enriched);
}
