import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function GET() {
  try {
    const results = await prisma.schoolYear.findMany({
      orderBy: { startDate: "asc" },
      include: {
        classes: {
          include: {
            Student: true,
          },
        },
      },
    });

    const data = results.map((year) => ({
      year: year.name,
      élèves: year.classes.reduce((sum, cls) => sum + cls.Student.length, 0),
    }));

    return NextResponse.json(data);
  } catch (error) {
    console.error("Erreur API /count-by-year", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
