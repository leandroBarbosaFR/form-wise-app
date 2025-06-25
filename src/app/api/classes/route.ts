// ✅ Multi-tenant filter added (tenantId)
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/authOptions";
import { prisma } from "../../../../src/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "DIRECTOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, monthlyFee, schoolYearId } = await req.json();

  try {
    const newClass = await prisma.class.create({
      data: {
        name,
        monthlyFee,
        schoolYear: { connect: { id: schoolYearId } }, // ✅ correction ici
        tenant: { connect: { id: session.user.tenantId } },
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
      where: {
        tenantId: session.user.tenantId, // ✅ filtre par tenant
      },
      include: {
        schoolYear: true,
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
