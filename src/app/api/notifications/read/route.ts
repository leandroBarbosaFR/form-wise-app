import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "../../../../lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "PARENT") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { notificationId } = await req.json();

  try {
    await prisma.notificationRead.upsert({
      where: {
        notificationId_parentId: {
          notificationId,
          parentId: session.user.id,
        },
      },
      update: {
        readAt: new Date(),
      },
      create: {
        notificationId,
        parentId: session.user.id,
        readAt: new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
