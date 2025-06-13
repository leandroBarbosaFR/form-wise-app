import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function GET() {
  try {
    const parents = await prisma.user.findMany({
      where: { role: "PARENT" },
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
