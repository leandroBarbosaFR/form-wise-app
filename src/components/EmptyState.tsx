"use client";

import { Button } from "@/components/ui/button";

import { LucideInfo } from "lucide-react";

interface EmptyStateProps {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  message,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-4 border border-dashed rounded-xl bg-muted/20">
      <LucideInfo className="h-10 w-10 text-muted-foreground mb-4" />
      <p className="text-lg font-medium text-muted-foreground mb-4">
        {message}
      </p>
      {actionLabel && onAction && (
        <Button variant="default" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
