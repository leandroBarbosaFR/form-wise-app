// components/ui/CenteredSpinner.tsx
import { Loader2 } from "lucide-react";

export default function CenteredSpinner({
  label = "Chargement...",
}: {
  label?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-muted-foreground">
      <Loader2 className="w-8 h-8 animate-spin mb-4" />
      <p>{label}</p>
    </div>
  );
}
