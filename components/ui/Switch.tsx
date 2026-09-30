"use client";

import { useId } from "react";
import { cn } from "@/lib/cn";

interface SwitchProps {
  label: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

/** Liga/desliga para filtros como "Sem leilão". */
export function Switch({
  label,
  description,
  checked,
  onCheckedChange,
  disabled,
  className,
}: SwitchProps) {
  const id = useId();

  return (
    <div className={cn("flex items-center justify-between gap-4", className)}>
      <span className="flex flex-col">
        <span id={`${id}-label`} className="text-sm text-chrome">
          {label}
        </span>
        {description && <span className="text-xs text-chrome-muted">{description}</span>}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={`${id}-label`}
        disabled={disabled}
        onClick={() => onCheckedChange(!checked)}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition duration-150 after:absolute after:-inset-2.5 after:content-[''] disabled:opacity-50",
          checked ? "border-lime-ink bg-lime" : "border-border bg-[#D5D9DE]",
        )}
      >
        <span
          aria-hidden
          className={cn(
            "inline-block size-4 rounded-full transition duration-150",
            checked ? "translate-x-6 bg-white" : "translate-x-1 bg-white shadow ring-1 ring-black/10",
          )}
        />
      </button>
    </div>
  );
}
