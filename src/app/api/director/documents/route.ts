// ✅ Multi-tenant filter added (tenantId) with SUPER_ADMIN support
import { NextResponse } from "next/server";
import { authOptions } from "../../../../lib/authOptions";
import { getServerSession } from "next-auth";
import { prisma } from "../../../../lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  // Vérifier les permissions
  const allowedRoles = ["SUPER_ADMIN", "DIRECTOR"];
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

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "5", 10);
  const search = searchParams.get("search")?.toLowerCase() || "";
  const classId = searchParams.get("classId");
  const code = searchParams.get("code");

  try {
    // Construction conditionnelle du filtre tenant
    const tenantFilter =
      session.user.role === "SUPER_ADMIN"
        ? {} // SUPER_ADMIN voit tous les étudiants
        : { tenantId: session.user.tenantId as string };

    const where: Prisma.StudentWhereInput = {
      ...tenantFilter,
      ...(search && {
        OR: [
          {
            firstName: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            lastName: {
              contains: search,
              mode: "insensitive",
            },
          },
        ],
      }),
      ...(classId && { classId: { equals: classId } }),
      ...(code && { code: { contains: code, mode: "insensitive" } }),
    };

    const [students, total] = await Promise.all([
      prisma.student.findMany({
        where,
        include: {
          documents: {
            orderBy: { createdAt: "desc" },
          },
          // Inclure les infos du tenant pour SUPER_ADMIN
          ...(session.user.role === "SUPER_ADMIN" && {
            tenant: {
              select: {
                id: true,
                name: true,
                schoolCode: true,
              },
            },
          }),
        },
        orderBy: { lastName: "asc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),

      prisma.student.count({ where }),
    ]);

    return NextResponse.json({ students, total, page, pageSize });
  } catch (error) {
    console.error("Erreur récupération documents élèves :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
