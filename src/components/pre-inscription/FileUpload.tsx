"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { toast } from "sonner";

interface FileUploadProps {
  onUploadCompleteAction: (uploadedUrls: {
    motivationLetterUrl: string | null;
    schoolResultsUrl: string | null;
    familyBookUrl: string | null;
  }) => void;
}

export default function FileUpload({
  onUploadCompleteAction,
}: FileUploadProps) {
  const [files, setFiles] = useState<{
    motivationLetter?: File;
    schoolResults?: File;
    familyBook?: File;
  }>({});

  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    setUploading(true);

    const uploadOne = async (file: File | undefined, folder: string) => {
      if (!file) return null;

      const cleanFileName = file.name
        .normalize("NFD") // enlève les accents
        .replace(/[\u0300-\u036f]/g, "") // retire les caractères Unicode combinés
        .replace(/\s+/g, "-") // remplace les espaces par des tirets
        .replace(/[^a-zA-Z0-9.\-_]/g, ""); // enlève les caractères non valides

      const path = `${folder}/${Date.now()}-${cleanFileName}`;

      const { data, error } = await supabase.storage
        .from("preinscriptions")
        .upload(path, file);

      if (error) {
        console.error(`Erreur upload ${folder}:`, error.message);
        toast.error(`Erreur pour ${folder} : ${error.message}`);
        return null;
      }

      const url = supabase.storage
        .from("preinscriptions")
        .getPublicUrl(data.path);

      return url.data.publicUrl;
    };

    const [motivationLetterUrl, schoolResultsUrl, familyBookUrl] =
      await Promise.all([
        uploadOne(files.motivationLetter, "motivation"),
        uploadOne(files.schoolResults, "results"),
        uploadOne(files.familyBook, "livret"),
      ]);

    onUploadCompleteAction({
      motivationLetterUrl,
      schoolResultsUrl,
      familyBookUrl,
    });

    toast.success("Les fichiers ont été correctement envoyés.");
    setUploading(false);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Pièces à fournir</h3>

      <div className="space-y-2">
        <Label>Lettre de motivation</Label>
        <Input
          type="file"
          accept=".pdf,.jpg,.png"
          onChange={(e) =>
            setFiles((f) => ({ ...f, motivationLetter: e.target.files?.[0] }))
          }
        />
      </div>

      <div className="space-y-2">
        <Label>Résultats scolaires</Label>
        <Input
          type="file"
          accept=".pdf,.jpg,.png"
          onChange={(e) =>
            setFiles((f) => ({ ...f, schoolResults: e.target.files?.[0] }))
          }
        />
      </div>

      <div className="space-y-2">
        <Label>Livret de famille</Label>
        <Input
          type="file"
          accept=".pdf,.jpg,.png"
          onChange={(e) =>
            setFiles((f) => ({ ...f, familyBook: e.target.files?.[0] }))
          }
        />
      </div>

      <button
        type="button"
        onClick={handleUpload}
        disabled={uploading}
        className="mt-2 rounded bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 transition"
      >
        {uploading ? "Envoi en cours..." : "Uploader les fichiers"}
      </button>
    </div>
  );
}
