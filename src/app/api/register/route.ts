// ✅ Multi-tenant inscription via code école
import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import bcrypt from "bcryptjs";
import { resend } from "../../../lib/resend";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      email,
      password,
      firstName,
      lastName,
      phone,
      civility,
      schoolCode,
    } = body;

    const role = "PARENT";

    if (
      !email?.trim() ||
      !password?.trim() ||
      !firstName?.trim() ||
      !lastName?.trim() ||
      !phone?.trim()
    ) {
      return NextResponse.json(
        { success: false, error: "Champs requis manquants" },
        { status: 400 }
      );
    }

    // Vérifie si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "Cet email est déjà utilisé." },
        { status: 400 }
      );
    }

    // Vérifie le code école
    if (!schoolCode || schoolCode.trim() === "") {
      return NextResponse.json(
        {
          success: false,
          error: "Le code de l’école est requis pour créer un compte parent.",
        },
        { status: 400 }
      );
    }

    const tenant = await prisma.tenant.findUnique({
      where: { schoolCode: schoolCode.trim() },
    });

    if (!tenant) {
      return NextResponse.json(
        { success: false, error: "Code de l’école invalide." },
        { status: 404 }
      );
    }

    // 🔒 Vérifie que le parent a bien été invité
    const invited = await prisma.invitedParent.findFirst({
      where: {
        email,
        tenantId: tenant.id,
        used: false,
      },
    });

    if (!invited) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Aucune invitation valide trouvée pour cet email et cette école.",
        },
        { status: 401 }
      );
    }

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone,
        role,
        civility,
        tenantId: tenant.id,
      },
    });

    // ✅ Marque l'invitation comme utilisée
    await prisma.invitedParent.update({
      where: { id: invited.id },
      data: { used: true, firstName },
    });

    // Envoi de l'email de bienvenue
    await resend.emails.send({
      from: "Formwise <onboarding@formwise.fr>",
      to: [email],
      subject: "Bienvenue sur Formwise !",
      html: `
        <p>Bonjour ${firstName},</p>
        <p>Votre compte a été créé avec succès.</p>
        <p><a href="https://formwise.fr/login?email=${encodeURIComponent(
          email
        )}">Cliquez ici pour vous connecter</a></p>
        <p>À bientôt !</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Erreur dans /api/register :", error);
    return NextResponse.json(
      { success: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
