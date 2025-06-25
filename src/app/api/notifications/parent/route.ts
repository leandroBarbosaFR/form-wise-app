// ✅ Multi-tenant filter added (tenantId)
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/authOptions";
import { prisma } from "../../../../lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "DIRECTOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const students = await prisma.student.findMany({
      where: {
        tenantId: session.user.tenantId, // ✅ ensure isolation by tenant
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
      },
    });

    return NextResponse.json({ students });
  } catch (error) {
    console.error("Erreur lors de la récupération des élèves:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
