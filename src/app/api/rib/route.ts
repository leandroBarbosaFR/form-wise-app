// ✅ Multi-tenant filter added (tenantId)
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/authOptions";
import { prisma } from "../../../lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "PARENT") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findFirst({
    where: {
      email: session.user.email!,
      tenantId: session.user.tenantId, // ✅ filtrage par tenant
    },
    select: {
      iban: true,
      bic: true,
      bankName: true,
    },
  });

  return NextResponse.json(user ?? {});
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "PARENT") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { iban, bic, bankName } = await req.json();

  if (!iban || !bic || !bankName) {
    return NextResponse.json({ error: "Champs requis" }, { status: 400 });
  }

  await prisma.user.updateMany({
    where: {
      email: session.user.email!,
      tenantId: session.user.tenantId, // ✅ filtrage par tenant
    },
    data: { iban, bic, bankName },
  });

  return NextResponse.json({ success: true });
}
