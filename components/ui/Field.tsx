import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { FieldTone } from "./fieldStyles";

interface FieldProps {
  id: string;
  label: string;
  hint?: ReactNode;
  error?: string;
  required?: boolean;
  /** Conteúdo exibido à direita do label (ex.: contador de caracteres). */
  aside?: ReactNode;
  className?: string;
  tone?: FieldTone;
  children: ReactNode;
}

export function fieldHintId(id: string): string {
  return `${id}-hint`;
}

export function fieldErrorId(id: string): string {
  return `${id}-error`;
}

/** Envolve um controle de formulário com label, dica e mensagem de erro. */
export function Field({ id, label, hint, error, required, aside, className, tone = "dark", children }: FieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div className="flex items-baseline justify-between gap-2">
        <label
          htmlFor={id}
          className={cn(tone === "dark" ? "text-sm font-medium text-chrome" : "text-[13px] font-semibold text-ink")}
        >
          {label}
          {required && (
            <span className="text-lime-ink" aria-hidden>
              {" "}
              *
            </span>
          )}
        </label>
        {aside && <span className="text-xs text-chrome-muted">{aside}</span>}
      </div>
      {children}
      {error ? (
        <p id={fieldErrorId(id)} role="alert" className="text-xs text-danger-ink">
          {error}
        </p>
      ) : (
        hint && (
          <p id={fieldHintId(id)} className="text-xs text-chrome-muted">
            {hint}
          </p>
        )
      )}
    </div>
  );
}

/** aria-describedby coerente com o que o Field está exibindo. */
export function describedBy(id: string, error?: string, hint?: ReactNode): string | undefined {
  if (error) return fieldErrorId(id);
  if (hint) return fieldHintId(id);
  return undefined;
}
