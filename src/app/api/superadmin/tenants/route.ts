// app/api/superadmin/tenants/route.ts
import { prisma } from "../../../../lib/prisma";
import { authOptions } from "../../../../lib/authOptions";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "SUPER_ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const tenants = await prisma.tenant.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      users: {
        where: { role: "DIRECTOR" },
        select: { email: true, firstName: true, lastName: true },
      },
    },
  });

  return NextResponse.json({ tenants });
}
