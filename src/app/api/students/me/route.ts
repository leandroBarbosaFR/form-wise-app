// ✅ Multi-tenant filter added (tenantId)
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/authOptions";
import { prisma } from "../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user || user.role !== "PARENT") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const students = await prisma.student.findMany({
      where: {
        parentId: user.id,
        tenantId: user.tenantId, // ✅ Filtrage multi-tenant
        status: "APPROVED",
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
      },
    });

    return NextResponse.json({ students });
  } catch (error) {
    console.error("Erreur API /students/me:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
