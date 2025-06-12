import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json(
        { success: false, error: "Données manquantes." },
        { status: 400 }
      );
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { email: string };

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { email: decoded.email },
      data: { password: hashedPassword },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    const err = error as Error & { name?: string };
    console.error("Erreur reset-password:", error);
    if (err.name === "TokenExpiredError") {
      return NextResponse.json(
        { success: false, error: "Lien expiré. Veuillez recommencer." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Lien invalide ou expiré." },
      { status: 400 }
    );
  }
}
