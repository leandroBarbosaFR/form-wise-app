import { prisma } from "../../../lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");
  const code = req.nextUrl.searchParams.get("schoolCode");

  if (!email || !code) {
    return NextResponse.json({ valid: false });
  }

  const staff = await prisma.staff.findFirst({
    where: {
      email,
      schoolCode: code,
      accepted: false,
    },
  });

  return NextResponse.json({ valid: !!staff });
}
