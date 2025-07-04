import { NextResponse } from "next/server";
import { faq } from "../../../lib/faq";

export async function POST(req: Request) {
  const { role, message } = await req.json();

  if (!role || !message) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  const roleFAQ = faq[role] || {};
  const lower = message.toLowerCase();

  const found = Object.entries(roleFAQ).find(([question]) =>
    lower.includes(question)
  );

  if (found) {
    return NextResponse.json({ answer: found[1] });
  }

  return NextResponse.json({
    answer:
      "Je ne suis pas encore programmé pour répondre à cette question. 😔",
  });
}
