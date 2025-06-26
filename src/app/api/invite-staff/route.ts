import { prisma } from "../../../lib/prisma";
import { authOptions } from "../../../lib/authOptions";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { resend } from "../../../lib/resend";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "DIRECTOR") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await req.json();
    const { email, firstName, lastName, phone, roleLabel } = body;

    if (!email || !firstName || !lastName || !phone || !roleLabel) {
      return NextResponse.json(
        { error: "Champs requis manquants." },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Format d'email invalide." },
        { status: 400 }
      );
    }

    const tenant = await prisma.tenant.findUnique({
      where: {
        id: session.user.tenantId,
      },
      select: {
        schoolCode: true,
        name: true, // Get school name for email
      },
    });

    if (!tenant) {
      return NextResponse.json({ error: "École introuvable" }, { status: 404 });
    }

    const schoolCode = tenant.schoolCode;

    // Check if staff already exists (including accepted ones)
    const existingStaff = await prisma.staff.findFirst({
      where: {
        email,
        tenantId: session.user.tenantId,
      },
    });

    if (existingStaff) {
      if (existingStaff.accepted) {
        return NextResponse.json(
          {
            error:
              "Un membre du staff avec cet email a déjà accepté l'invitation.",
          },
          { status: 409 }
        );
      } else {
        // Update existing invitation instead of creating new one
        await prisma.staff.update({
          where: { id: existingStaff.id },
          data: {
            firstName,
            lastName,
            phone,
            roleLabel,
          },
        });
        // Send email with existing invitation
        await sendInvitationEmail(
          email,
          firstName,
          roleLabel,
          schoolCode,
          tenant.name
        );
        return NextResponse.json({
          success: true,
          message: "Invitation mise à jour et renvoyée",
        });
      }
    }

    // Create new staff invitation
    await prisma.staff.create({
      data: {
        email,
        firstName,
        lastName,
        phone,
        roleLabel,
        tenantId: session.user.tenantId!,
        schoolCode,
      },
    });

    // Send invitation email
    await sendInvitationEmail(
      email,
      firstName,
      roleLabel,
      schoolCode,
      tenant.name
    );

    return NextResponse.json({
      success: true,
      message: "Invitation envoyée avec succès",
    });
  } catch (error) {
    console.error("❌ Erreur dans /api/invite-staff :", error);
    return NextResponse.json(
      { error: "Erreur interne serveur" },
      { status: 500 }
    );
  }
}

async function sendInvitationEmail(
  email: string,
  firstName: string,
  roleLabel: string,
  schoolCode: string,
  schoolName: string
) {
  const registerUrl = `${process.env.NEXT_PUBLIC_APP_URL}/register-staff?email=${encodeURIComponent(
    email
  )}&schoolCode=${schoolCode}`;

  await resend.emails.send({
    from: "Formwise <onboarding@formwise.fr>",
    to: email,
    subject: "Invitation à rejoindre votre école sur Formwise",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Bienvenue sur Formwise !</h2>
        
        <p>Bonjour ${firstName},</p>
        
        <p>Vous avez été invité(e) à rejoindre <strong>${schoolName}</strong> sur Formwise en tant que <strong>${roleLabel}</strong>.</p>
        
        <p>Pour créer votre compte et accéder à la plateforme, veuillez cliquer sur le bouton ci-dessous :</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${registerUrl}" 
             style="background-color: #0066cc; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Créer mon compte
          </a>
        </div>
        
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 0;"><strong>Code de l'établissement :</strong> <code style="background-color: #e0e0e0; padding: 2px 6px; border-radius: 3px;">${schoolCode}</code></p>
          <p style="margin: 5px 0 0 0; font-size: 14px; color: #666;">Vous devrez saisir ce code lors de votre inscription.</p>
        </div>
        
        <p style="color: #666; font-size: 14px;">
          Si vous n'arrivez pas à cliquer sur le bouton, copiez et collez ce lien dans votre navigateur :<br>
          <a href="${registerUrl}">${registerUrl}</a>
        </p>
        
        <p>Merci et bienvenue dans l'équipe !</p>
        
        <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
        <p style="color: #999; font-size: 12px;">
          Cet email a été envoyé par Formwise. Si vous n'attendiez pas cette invitation, vous pouvez ignorer ce message.
        </p>
      </div>
    `,
  });
}
