// ✅ app/api/documents/route.ts
import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function POST(req: Request) {
  try {
    console.log("📥 POST /api/documents called");

    const body = await req.json();
    console.log("📝 Raw request body:", JSON.stringify(body, null, 2));

    const { studentId, url, fileName, fileType } = body;

    console.log("🔍 Extracted values:");
    console.log("  - studentId:", `"${studentId}"` || "UNDEFINED");
    console.log("  - url:", `"${url}"` || "UNDEFINED");
    console.log("  - fileName:", `"${fileName}"` || "UNDEFINED");
    console.log("  - fileType:", `"${fileType}"` || "UNDEFINED");

    if (!studentId || !url || !fileName) {
      console.error("❌ Validation failed:");
      console.error("  - studentId valid:", !!studentId);
      console.error("  - url valid:", !!url);
      console.error("  - fileName valid:", !!fileName);

      return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
    }

    console.log("✅ Validation passed, creating document...");

    const document = await prisma.document.create({
      data: {
        studentId,
        url,
        fileName,
        fileType,
      },
    });

    console.log("✅ Document created successfully:", document.id);

    return NextResponse.json({ document }, { status: 201 });
  } catch (error) {
    console.error("❌ Erreur API /api/documents:", error);

    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: "JSON invalide" }, { status: 400 });
    }

    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
