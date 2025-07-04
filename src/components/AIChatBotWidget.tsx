"use client";

import { useState } from "react";
import { Bot, Send, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "next-auth/react";

const suggestions = [
  "Comment inscrire mon enfant ?",
  "Comment envoyer un document ?",
  "Comment inviter un parent ?",
  "Comment créer une classe ?",
];

export default function AIChatBotWidget() {
  const { data: session } = useSession();
  const role = session?.user?.role || "PARENT";

  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAsk = async (q?: string) => {
    const msg = q || question;
    if (!msg.trim()) return;
    setLoading(true);
    setAnswer("");
    setQuestion(q || "");

    const res = await fetch("/api/ai", {
      method: "POST",
      body: JSON.stringify({ role, message: msg }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    setAnswer(data.answer);
    setLoading(false);
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        {open && (
          <div className="w-[360px] max-h-[520px] bg-white rounded-xl shadow-xl border flex flex-col overflow-hidden mb-3 animate-in fade-in slide-in-from-bottom-2">
            {/* Header */}
            <div className="bg-black text-white px-4 py-3 flex items-center justify-between">
              <span className="text-sm font-medium">Assistant Formwise 🤖</span>
              <button onClick={() => setOpen(false)}>
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4 text-sm text-muted-foreground overflow-y-auto flex-1">
              {!answer && (
                <div className="bg-muted p-3 rounded-md text-sm text-gray-700">
                  👋 Bonjour ! Posez-moi une question sur l’inscription ou le
                  fonctionnement de la plateforme.
                </div>
              )}

              {answer && (
                <Textarea
                  value={answer}
                  readOnly
                  className="bg-muted-foreground/10 text-sm"
                  rows={6}
                />
              )}

              {!answer && (
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((sugg, idx) => (
                    <Button
                      key={idx}
                      variant="outline"
                      className="text-xs"
                      onClick={() => handleAsk(sugg)}
                    >
                      {sugg}
                    </Button>
                  ))}
                </div>
              )}
            </div>

            {/* Input */}
            <div className="border-t px-4 py-3 flex gap-2 items-center">
              <Input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Votre message..."
                className="flex-1"
              />
              <Button
                size="icon"
                onClick={() => handleAsk()}
                disabled={loading}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Floating button */}
        <Button
          size="icon"
          className="rounded-full shadow-lg bg-black text-white hover:bg-black/80"
          onClick={() => setOpen(!open)}
        >
          <Bot className="h-5 w-5" />
        </Button>
      </div>
    </>
  );
}
