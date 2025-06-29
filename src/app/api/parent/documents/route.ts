// ✅ Multi-tenant filter added (tenantId)

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/authOptions";
import { prisma } from "../../../../lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  // Vérifier les permissions
  const allowedRoles = ["SUPER_ADMIN", "PARENT"];
  if (!allowedRoles.includes(session.user.role)) {
    return NextResponse.json(
      { error: "Permissions insuffisantes" },
      { status: 403 }
    );
  }

  // Vérifier que les non-SUPER_ADMIN ont un tenantId
  if (session.user.role !== "SUPER_ADMIN" && !session.user.tenantId) {
    return NextResponse.json(
      { error: "Utilisateur sans tenant" },
      { status: 403 }
    );
  }

  const parentEmail = session.user.email!;

  // Construction conditionnelle du filtre selon le rôle
  const whereClause =
    session.user.role === "SUPER_ADMIN"
      ? {
          parent: {
            email: parentEmail,
          },
        }
      : {
          tenantId: session.user.tenantId as string, // ✅ isolate by school
          parent: {
            email: parentEmail,
          },
        };

  const students = await prisma.student.findMany({
    where: whereClause,
    select: {
      id: true,
      firstName: true,
      lastName: true,
      documents: {
        select: {
          id: true,
          url: true,
          fileName: true,
          fileType: true,
          createdAt: true,
        },
      },
    },
  });

  return NextResponse.json({ students });
}
