// app/api/check-code/route.ts
import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json(
      { valid: false, error: "Code manquant" },
      { status: 400 }
    );
  }

  const tenant = await prisma.tenant.findUnique({
    where: { schoolCode: code.trim() },
    select: { name: true },
  });

  if (!tenant) {
    return NextResponse.json(
      { valid: false, error: "Code invalide" },
      { status: 404 }
    );
  }

  return NextResponse.json({ valid: true, name: tenant.name });
}
