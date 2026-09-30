import { X } from "lucide-react";
import { cn } from "@/lib/cn";

interface ChipProps {
  label: string;
  onRemove: () => void;
  className?: string;
}

/** Filtro ativo que pode ser removido com um toque. */
export function Chip({ label, onRemove, className }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onRemove}
      aria-label={`Remover filtro: ${label}`}
      className={cn(
        "inline-flex h-10 items-center sm:h-8 gap-1.5 rounded-full border border-border bg-surface-2 pl-3 pr-2 text-sm text-chrome transition duration-150 hover:border-lime-ink",
        className,
      )}
    >
      {label}
      <X aria-hidden className="size-3.5 text-chrome-muted" />
    </button>
  );
}
