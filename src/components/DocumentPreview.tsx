"use client";
import Image from "next/image";

interface DocumentPreviewProps {
  url: string;
  fileName: string;
  fileType: string;
}

export default function DocumentPreview({
  url,
  fileName,
  fileType,
}: DocumentPreviewProps) {
  if (fileType.startsWith("image/")) {
    return (
      <div className="mt-2">
        <Image
          src={url}
          alt={fileName}
          width={300}
          height={200}
          className="rounded border shadow"
        />
      </div>
    );
  }

  if (fileType === "application/pdf") {
    return (
      <div className="mt-2">
        <iframe
          src={url}
          className="w-full max-w-md h-64 rounded border"
          title={fileName}
        />
      </div>
    );
  }

  return (
    <div className="mt-2">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline"
      >
        Télécharger {fileName}
      </a>
    </div>
  );
}
