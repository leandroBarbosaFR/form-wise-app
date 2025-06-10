import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/authOptions";
import { prisma } from "../../../../lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "PARENT") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { notificationId } = await req.json();

  if (!notificationId) {
    return NextResponse.json({ error: "ID manquant" }, { status: 400 });
  }

  const alreadyRead = await prisma.notificationRead.findFirst({
    where: {
      notificationId,
      parentId: session.user.id,
    },
  });

  if (alreadyRead) {
    return NextResponse.json({ success: true, message: "Déjà lu" });
  }

  await prisma.notificationRead.create({
    data: {
      notificationId,
      parentId: session.user.id,
      readAt: new Date(),
    },
  });

  return NextResponse.json({ success: true });
}
