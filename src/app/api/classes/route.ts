import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { prisma } from "../../../../src/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "DIRECTOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { name, monthlyFee, schoolYearId } = body;

  try {
    const newClass = await prisma.class.create({
      data: {
        name,
        monthlyFee,
        schoolYearId,
      },
    });

    return NextResponse.json({ success: true, class: newClass });
  } catch (error) {
    console.error("Erreur création classe :", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "DIRECTOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const classes = await prisma.class.findMany({
      include: {
        schoolYear: true, // Pour inclure le nom de l'année scolaire
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ classes });
  } catch (error) {
    console.error("Erreur récupération classes :", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
