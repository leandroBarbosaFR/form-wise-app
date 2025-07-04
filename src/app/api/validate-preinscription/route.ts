import React from "react";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/authOptions";
import { prisma } from "../../../lib/prisma";
import { resend } from "../../../lib/resend";
import { render } from "@react-email/render";
import ValidateEmailTemplate from "../../../components/emails/ValidateEmailTemplate";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "DIRECTOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { childId, decision } = await req.json();

  if (!childId || !["ACCEPTED", "REJECTED"].includes(decision)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  try {
    const child = await prisma.preRegistrationChild.update({
      where: { id: childId },
      data: { status: decision },
      include: {
        parent: {
          select: {
            email: true,
            firstName: true,
            lastName: true,
            tenantId: true,
            tenant: {
              select: {
                schoolCode: true,
              },
            },
          },
        },
      },
    });

    const schoolCode = child.parent.tenant?.schoolCode;
    const registrationLink = `https://formwise.fr/register`;

    if (!schoolCode) {
      return NextResponse.json(
        { error: "Code établissement manquant" },
        { status: 500 }
      );
    }

    // 🔒 AJOUT : enregistrement de l'email dans invitedParent si ACCEPTED
    if (decision === "ACCEPTED") {
      const alreadyInvited = await prisma.invitedParent.findFirst({
        where: {
          email: child.parent.email,
          tenantId: child.parent.tenantId,
        },
      });

      if (!alreadyInvited) {
        await prisma.invitedParent.create({
          data: {
            email: child.parent.email,
            tenantId: child.parent.tenantId,
            used: false,
          },
        });
      }
    }

    const emailHtml = await render(
      React.createElement(ValidateEmailTemplate, {
        decision: decision as "ACCEPTED" | "REJECTED",
        childName: `${child.firstName} ${child.lastName}`,
        parentName: `${child.parent.firstName} ${child.parent.lastName}`,
        schoolCode,
        registrationLink,
      })
    );

    await resend.emails.send({
      from: "Formwise <onboarding@formwise.fr>",
      to: child.parent.email,
      subject:
        decision === "ACCEPTED"
          ? "Votre préinscription a été acceptée"
          : "Votre préinscription a été refusée",
      html: emailHtml,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue." },
      { status: 500 }
    );
  }
}
