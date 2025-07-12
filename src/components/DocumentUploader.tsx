"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "../lib/supabase";

interface Props {
  studentId: string;
}

export default function DocumentUploader({ studentId }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) return toast.error("Aucun fichier sélectionné");

    setUploading(true);

    try {
      // Upload to Supabase Storage
      const filePath = `${studentId}/${Date.now()}_${file.name}`;

      console.log("🚀 Uploading to Supabase...");

      const { error: uploadError } = await supabase.storage
        .from("documents")
        .upload(filePath, file);

      if (uploadError) {
        console.error("❌ Supabase upload failed:", uploadError);
        toast.error("Échec de l'envoi du fichier");
        return;
      }

      console.log("✅ Upload réussi !");
      // Get public URL
      const { data } = supabase.storage
        .from("documents")
        .getPublicUrl(filePath);

      const publicUrl = data?.publicUrl;

      // Save to database via API
      const payload = {
        studentId,
        url: publicUrl,
        fileName: file.name,
        fileType: file.type,
      };

      console.log("📝 Sending to API:", payload);

      try {
        const res = await fetch("/api/documents", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        console.log("📊 API Response status:", res.status);
      } catch (fetchError) {
        console.error("🌐 FETCH ERROR:", fetchError);
        toast.error("Problème de réseau ou d'API");
      }

      toast.success("Document envoyé avec succès !");
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      console.error("❌ Unexpected error:", error);
      toast.error("Erreur inattendue lors de l'envoi");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4 border p-4 rounded-md shadow-sm">
      <Label>Fichier (PDF ou image)</Label>
      <Input
        type="file"
        accept="image/*,application/pdf"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <Button
        className="cursor-pointer"
        onClick={handleUpload}
        disabled={uploading || !file}
      >
        {uploading ? "Envoi en cours..." : "Envoyer"}
      </Button>

      {file && (
        <p className="text-sm text-gray-600">
          Fichier sélectionné: {file.name}
        </p>
      )}
    </div>
  );
}
