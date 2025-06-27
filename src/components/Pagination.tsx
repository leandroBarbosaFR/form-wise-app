"use client";

import { Button } from "@/components/ui/button";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChangeAction: (page: number) => void;
};

export default function Pagination({
  currentPage,
  totalPages,
  onPageChangeAction,
}: PaginationProps) {
  return (
    <div className="flex items-center justify-between pt-4">
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChangeAction(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Précédent
        </Button>
        <span className="text-sm pt-1">
          Page {currentPage} / {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChangeAction(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Suivant
        </Button>
      </div>
    </div>
  );
}
