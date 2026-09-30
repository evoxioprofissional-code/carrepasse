import { PencilLine } from "lucide-react";
import type { ReactNode } from "react";

interface SummaryRowProps {
  title: string;
  /** Etapa para onde o "Editar" leva (sem ele, a linha é só leitura). */
  step?: number;
  onGoTo: (step: number) => void;
  children: ReactNode;
}

export function SummaryRow({ title, step, onGoTo, children }: SummaryRowProps) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-border py-3 last:border-none">
      <div className="min-w-0">
        <p className="text-xs text-chrome-muted">{title}</p>
        <div className="text-sm text-chrome">{children}</div>
      </div>
      {step !== undefined && (
        <button
          type="button"
          onClick={() => onGoTo(step)}
          className="-my-1 flex min-h-11 shrink-0 items-center gap-1 rounded-lg px-2 text-sm font-semibold text-lime-ink hover:bg-surface-2"
        >
          <PencilLine aria-hidden className="size-4" />
          Editar
        </button>
      )}
    </div>
  );
}
