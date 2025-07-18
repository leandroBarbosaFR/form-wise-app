import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import bcrypt from "bcryptjs";
import { sendEmailWithTempPassword } from "../../../../lib/email";
import { addDays } from "date-fns";
import { generateSchoolCode } from "../../../../lib/generateSchoolCode";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { firstName, lastName, schoolName, phone, address, email } = body;

    if (!email || !firstName || !lastName || !schoolName) {
      return NextResponse.json(
        { error: "Champs requis manquants." },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "Un compte existe déjà avec cet email." },
        { status: 409 }
      );
    }

    const trialEndsAt = addDays(new Date(), 20);
    const tempPassword = Math.random().toString(36).slice(-10);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // ✅ Génère un code école unique
    let schoolCode = generateSchoolCode(schoolName);
    let existingCode = await prisma.tenant.findUnique({
      where: { schoolCode },
    });
    while (existingCode) {
      schoolCode = generateSchoolCode(schoolName);
      existingCode = await prisma.tenant.findUnique({ where: { schoolCode } });
    }

    const tenant = await prisma.tenant.create({
      data: {
        name: schoolName,
        phone,
        address,
        status: "TRIAL",
        trialEndsAt,
        schoolCode,
      },
    });

    const user = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        password: hashedPassword,
        role: "DIRECTOR",
        tenantId: tenant.id,
        phone,
      },
    });
    console.log("Utilisateur créé :", user);

    await sendEmailWithTempPassword({
      to: email,
      name: firstName,
      password: tempPassword,
    });

    return NextResponse.json({ success: true, tenantId: tenant.id });
  } catch (error) {
    console.error("Erreur création free trial :", error);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
