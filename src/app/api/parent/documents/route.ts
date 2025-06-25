// ✅ Multi-tenant filter added (tenantId)

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/authOptions";
import { prisma } from "../../../../lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "PARENT") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parentEmail = session.user.email!;
  const tenantId = session.user.tenantId;

  const students = await prisma.student.findMany({
    where: {
      tenantId, // ✅ isolate by school
      parent: {
        email: parentEmail,
      },
    },
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
