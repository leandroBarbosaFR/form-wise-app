import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function GET() {
  try {
    const classes = await prisma.class.findMany({
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
