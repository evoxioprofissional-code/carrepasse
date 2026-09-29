"use client";

import { Info } from "lucide-react";
import { useId, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

interface TooltipProps {
  /** Nome acessível do botão, ex.: "O que é repasse?". */
  label: string;
  children: ReactNode;
  align?: "start" | "center" | "end";
  className?: string;
}

const alignments = {
  start: "left-0",
  center: "left-1/2 -translate-x-1/2",
  end: "right-0",
};

const VIEWPORT_GUTTER = 16;

/**
 * Ícone de informação com explicação curta. Abre no hover, no foco
 * e no toque (celular não tem hover).
 */
export function Tooltip({ label, children, align = "center", className }: TooltipProps) {
  const [open, setOpen] = useState(false);
  const [shift, setShift] = useState(0);
  const tooltipRef = useRef<HTMLSpanElement>(null);
  const tooltipId = useId();

  // Empurra o balão para dentro da tela quando ele encosta na borda.
  useLayoutEffect(() => {
    const tooltip = tooltipRef.current;
    if (!open || !tooltip) {
      setShift(0);
      return;
    }
    const rect = tooltip.getBoundingClientRect();
    const overflowRight = rect.right - (window.innerWidth - VIEWPORT_GUTTER);
    const overflowLeft = VIEWPORT_GUTTER - rect.left;
    if (overflowRight > 0) setShift(-overflowRight);
    else if (overflowLeft > 0) setShift(overflowLeft);
  }, [open]);

  return (
    <span
      className={cn("relative inline-flex", className)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-label={label}
        aria-expanded={open}
        aria-describedby={open ? tooltipId : undefined}
        onClick={() => setOpen((value) => !value)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={(event) => {
          if (event.key === "Escape") setOpen(false);
        }}
        className="-m-2 rounded-full p-2 text-chrome-muted transition duration-150 hover:text-brand"
      >
        <Info aria-hidden className="size-4" />
      </button>
      {open && (
        <span
          ref={tooltipRef}
          id={tooltipId}
          role="tooltip"
          style={{ translate: `${shift}px 0` }}
          className={cn(
            "absolute bottom-full z-20 mb-2 w-64 max-w-[calc(100vw-2rem)] rounded-lg border border-border bg-surface-2 p-3 text-left text-xs font-normal leading-relaxed text-chrome shadow-lg shadow-black/40",
            alignments[align],
          )}
        >
          {children}
        </span>
      )}
    </span>
  );
}
