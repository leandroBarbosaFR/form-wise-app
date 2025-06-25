// ✅ Multi-tenant filter added (tenantId)
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/authOptions";
import { prisma } from "../../../lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "DIRECTOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const schoolYears = await prisma.schoolYear.findMany({
    where: {
      tenantId: session.user.tenantId, // ✅ filtrage tenant
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ schoolYears });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "DIRECTOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { name, startDate, endDate } = body;

  try {
    const schoolYear = await prisma.schoolYear.create({
      data: {
        name,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        tenantId: session.user.tenantId, // ✅ assignation tenant
      },
    });

    return NextResponse.json({ success: true, schoolYear });
  } catch (error) {
    console.error("Erreur création année scolaire :", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
