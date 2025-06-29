// ✅ Multi-tenant: envoi du code école par mail avec support SUPER_ADMIN
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/authOptions";
import { prisma } from "../../../lib/prisma";
import { resend } from "../../../lib/resend";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  // Vérifier les permissions
  const allowedRoles = ["SUPER_ADMIN", "DIRECTOR"];
  if (!allowedRoles.includes(user.role)) {
    return NextResponse.json(
      { error: "Permissions insuffisantes" },
      { status: 403 }
    );
  }

  const { emails, tenantId } = await req.json();

  if (!emails || !Array.isArray(emails) || emails.length === 0) {
    return NextResponse.json(
      { error: "Aucune adresse email fournie" },
      { status: 400 }
    );
  }

  // Déterminer le tenantId à utiliser
  let targetTenantId: string;

  if (user.role === "SUPER_ADMIN") {
    // SUPER_ADMIN doit spécifier le tenantId dans le body
    if (!tenantId) {
      return NextResponse.json(
        { error: "tenantId requis pour les SUPER_ADMIN" },
        { status: 400 }
      );
    }
    targetTenantId = tenantId;
  } else {
    // DIRECTOR utilise son propre tenantId
    if (!user.tenantId) {
      return NextResponse.json(
        { error: "Utilisateur sans tenant" },
        { status: 403 }
      );
    }
    targetTenantId = user.tenantId;
  }

  const tenant = await prisma.tenant.findUnique({
    where: { id: targetTenantId },
    select: { schoolCode: true, name: true },
  });

  if (!tenant?.schoolCode) {
    return NextResponse.json(
      { error: "Code établissement introuvable" },
      { status: 500 }
    );
  }

  const results = await Promise.allSettled(
    emails.map((email: string) =>
      resend.emails.send({
        from: "Formwise <onboarding@formwise.fr>",
        to: [email],
        subject: "Invitation à rejoindre Formwise",
        html: `
          <p>Bonjour,</p>
          <p>Vous avez été invité à rejoindre <strong>${tenant.name}</strong> sur Formwise.</p>
          <p>Pour créer votre compte, utilisez ce code établissement :</p>
          <h2>${tenant.schoolCode}</h2>
          <p>👉 <a href="http://localhost:3000/register">Cliquez ici pour vous inscrire</a></p>
        `,
      })
    )
  );

  // Enregistre les invitations dans la DB
  await prisma.invitedParent.createMany({
    data: emails.map((email: string) => ({
      email,
      tenantId: targetTenantId,
      used: false,
    })),
    skipDuplicates: true, // évite les doublons
  });

  const successCount = results.filter((r) => r.status === "fulfilled").length;
  const failureCount = emails.length - successCount;

  return NextResponse.json({ success: true, successCount, failureCount });
}
