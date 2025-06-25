// ✅ Multi-tenant filter added (tenantId)
import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/authOptions";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user.tenantId) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const parents = await prisma.user.findMany({
      where: {
        role: "PARENT",
        tenantId: session.user.tenantId, // ✅ filtre multi-tenant
      },
      select: { iban: true },
    });

    const ribOk = parents.filter((p) => p.iban && p.iban.trim() !== "").length;
    const ribMissing = parents.length - ribOk;

    return NextResponse.json({
      ribOk,
      ribMissing,
    });
  } catch (error) {
    console.error("Erreur dans /api/rib/status", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
