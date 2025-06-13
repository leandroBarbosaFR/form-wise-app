import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function GET() {
  try {
    // Récupérer tous les parents
    const allParents = await prisma.user.findMany({
      where: { role: "PARENT" },
      select: { id: true },
    });
    const totalParents = allParents.length;

    // Récupérer toutes les notifications globales
    const globalNotifications = await prisma.notification.findMany({
      where: { isGlobal: true },
      include: {
        readBy: true,
      },
    });

    // Calculer combien ont été lues par tous les parents
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
