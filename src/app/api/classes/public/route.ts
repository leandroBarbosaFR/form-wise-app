// ✅ Multi-tenant filter added (tenantId)
import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/authOptions";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.tenantId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const classes = await prisma.class.findMany({
      where: {
        tenantId: session.user.tenantId, // ✅ filtre par tenant
      },
      select: {
        id: true,
        name: true,
        monthlyFee: true,
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ classes });
  } catch (error) {
    console.error("Erreur récupération des classes publiques :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
