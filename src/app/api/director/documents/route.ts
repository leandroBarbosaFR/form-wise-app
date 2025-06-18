import { NextResponse } from "next/server";
import { authOptions } from "../../../../lib/authOptions";
import { getServerSession } from "next-auth";
import { prisma } from "../../../../lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "DIRECTOR") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "5", 10);
  const search = searchParams.get("search")?.toLowerCase() || "";
  const classId = searchParams.get("classId");
  const code = searchParams.get("code");

  try {
    const where: Prisma.StudentWhereInput = {
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
