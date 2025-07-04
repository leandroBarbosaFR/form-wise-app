import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "../../../lib/prisma";
import { resend } from "../../../lib/resend";

const schema = z.object({
  parent: z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    phone: z.string(),
    address: z.string(),
  }),
  children: z.array(
    z.object({
      firstName: z.string(),
      lastName: z.string(),
      gender: z.enum(["FILLE", "GARÇON"]),
      birthDate: z.string(),
      birthCity: z.string(),
      birthCountry: z.string(),
      currentSchool: z.string(),
      desiredClass: z.string(),
    })
  ),
  uploadedFiles: z.object({
    motivationLetterUrl: z.string().nullable(),
    schoolResultsUrl: z.string().nullable(),
    familyBookUrl: z.string().nullable(),
  }),
  schoolCode: z.string(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("📦 Requête reçue", body);

    const data = schema.parse(body);
    console.log("✅ Données validées");

    const tenant = await prisma.tenant.findUnique({
      where: { schoolCode: data.schoolCode },
    });

    if (!tenant) {
      console.warn("❌ École introuvable pour code:", data.schoolCode);
      return NextResponse.json({ error: "École introuvable" }, { status: 404 });
    }

    console.log("🏫 École trouvée :", tenant.name);

    const parent = await prisma.preRegistrationParent.create({
      data: {
        ...data.parent,
        tenantId: tenant.id,
        children: {
          create: data.children.map((child) => ({
            ...child,
            birthDate: new Date(child.birthDate),
          })),
        },
      },
    });

    console.log("👪 Parent créé avec ID:", parent.id);

    await prisma.preRegistrationDocument.create({
      data: {
        parentId: parent.id,
        motivationLetterUrl: data.uploadedFiles.motivationLetterUrl,
        schoolResultsUrl: data.uploadedFiles.schoolResultsUrl,
        familyBookUrl: data.uploadedFiles.familyBookUrl,
      },
    });

    console.log("📄 Documents enregistrés");

    // 📧 Email au parent
    await resend.emails.send({
      from: "Formwise <onboarding@formwise.fr>",
      to: parent.email,
      subject: "Confirmation de votre pré-inscription",
      html: `
        <p>Bonjour ${parent.firstName},</p>
        <p>Nous confirmons la bonne réception de votre demande de pré-inscription pour l’établissement <strong>${tenant.name}</strong>.</p>
        <p>L’école vous recontactera sous peu.</p>
        <p>Merci et à bientôt !<br/>L’équipe Formwise</p>
      `,
    });
    console.log("📧 Email de confirmation envoyé à", parent.email);

    // 📧 Email au directeur (tenant)
    if (tenant.email) {
      await resend.emails.send({
        from: "Formwise <onboarding@formwise.fr>",
        to: tenant.email,
        subject: `Nouvelle pré-inscription - ${parent.firstName} ${parent.lastName}`,
        html: `
          <p>Bonjour,</p>
          <p>Une nouvelle demande de pré-inscription a été soumise pour votre établissement <strong>${tenant.name}</strong>.</p>
          <p><strong>Parent :</strong> ${parent.firstName} ${parent.lastName} (${parent.email})</p>
          <p>Vous pouvez la consulter dans votre dashboard.</p>
          <p>— Formwise</p>
        `,
      });
      console.log("📧 Notification envoyée au directeur à", tenant.email);
    } else {
      console.warn(
        "⚠️ Aucun email renseigné pour le directeur de l’école",
        tenant.name
      );
    }

    return NextResponse.json({ success: true, parentId: parent.id });
  } catch (error) {
    console.error("❌ Erreur préinscription :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
