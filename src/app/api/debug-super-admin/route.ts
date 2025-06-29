// Créez temporairement : /src/app/api/debug-super-admin/route.ts

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/authOptions";
import { prisma } from "../../../lib/prisma";

export async function GET() {
  try {
    console.log("🔍 DEBUG - Début du test SUPER_ADMIN");

    // 1. Vérifier l'utilisateur en base
    const dbUser = await prisma.user.findUnique({
      where: { email: "admin@formwise.app" },
      include: { tenant: true },
    });

    console.log("👤 DEBUG - Utilisateur en base:", {
      exists: !!dbUser,
      id: dbUser?.id,
      email: dbUser?.email,
      role: dbUser?.role,
      tenantId: dbUser?.tenantId,
      hasPassword: !!dbUser?.password,
    });

    // 2. Vérifier la session actuelle
    const session = await getServerSession(authOptions);

    console.log("🎫 DEBUG - Session actuelle:", {
      hasSession: !!session,
      user: session?.user
        ? {
            id: session.user.id,
            email: session.user.email,
            role: session.user.role,
            tenantId: session.user.tenantId,
          }
        : null,
    });

    return NextResponse.json({
      dbUser: dbUser
        ? {
            id: dbUser.id,
            email: dbUser.email,
            role: dbUser.role,
            tenantId: dbUser.tenantId,
            hasPassword: !!dbUser.password,
            tenant: dbUser.tenant,
          }
        : null,
      session: session?.user || null,
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("💥 DEBUG - Erreur:", error);
    return NextResponse.json(
      {
        error: "Erreur lors du debug",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
