import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function GET() {
  try {
    const classes = await prisma.class.findMany({
      select: {
        name: true,
        Student: true,
      },
    });

    const data = classes.map((cls) => ({
      class: cls.name,
      élèves: cls.Student.length,
    }));

    return NextResponse.json(data);
  } catch (error) {
    console.error("Erreur /api/students/by-class", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
