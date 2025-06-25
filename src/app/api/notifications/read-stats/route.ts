import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/authOptions";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user.tenantId) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const tenantId = session.user.tenantId;

    // 🔐 Ne récupérer que les parents de ce tenant
    const allParents = await prisma.user.findMany({
      where: {
        role: "PARENT",
        tenantId,
      },
      select: { id: true },
    });
    const totalParents = allParents.length;

    // 🔐 Ne récupérer que les notifications globales de ce tenant
    const globalNotifications = await prisma.notification.findMany({
      where: {
        isGlobal: true,
        tenantId,
      },
      include: {
        readBy: true,
      },
    });

    let totalLu = 0;
    let totalNonLu = 0;

    for (const notif of globalNotifications) {
      const lecteurs = new Set(notif.readBy.map((r) => r.parentId));
      totalLu += lecteurs.size;
      totalNonLu += totalParents - lecteurs.size;
    }

    return NextResponse.json({
      read: totalLu,
      unread: totalNonLu,
    });
  } catch (error) {
    console.error("Erreur dans /api/notifications/read-stats", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
