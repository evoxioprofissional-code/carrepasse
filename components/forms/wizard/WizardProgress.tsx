import { Check } from "lucide-react";
import { cn } from "@/lib/cn";
import { WIZARD_STEPS } from "@/lib/listing-form";

interface WizardProgressProps {
  step: number;
  /** Na edição a etapa "Carro" não é refeita. */
  firstStep?: number;
}

export function WizardProgress({ step, firstStep = 0 }: WizardProgressProps) {
  const steps = WIZARD_STEPS.slice(firstStep);
  const current = step - firstStep;
  const percent = ((current + 1) / steps.length) * 100;

  return (
    <div>
      <p className="text-sm text-chrome-muted" aria-live="polite">
        Etapa <strong className="text-chrome">{current + 1}</strong> de {steps.length} ·{" "}
        <span className="text-chrome">{steps[current]}</span>
      </p>
      <div
        className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-2"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={steps.length}
        aria-valuenow={current + 1}
        aria-label="Progresso do anúncio"
      >
        <div className="h-full rounded-full bg-brand transition-[width] duration-200" style={{ width: `${percent}%` }} />
      </div>
      {/* Nomes das etapas só onde cabem */}
      <ol className="mt-3 hidden gap-2 sm:flex">
        {steps.map((label, index) => (
          <li
            key={label}
            className={cn(
              "flex items-center gap-1.5 text-xs font-medium",
              index < current ? "text-lime-ink" : index === current ? "text-chrome" : "text-chrome-muted",
            )}
          >
            <span
              className={cn(
                "flex size-5 items-center justify-center rounded-full border text-[11px]",
                index < current ? "border-lime-ink bg-lime text-ink" : index === current ? "border-chrome" : "border-border",
              )}
            >
              {index < current ? <Check aria-hidden className="size-3" strokeWidth={3} /> : index + 1}
            </span>
            {label}
            {index < steps.length - 1 && <span aria-hidden className="mx-1 h-px w-4 bg-border" />}
          </li>
        ))}
      </ol>
    </div>
  );
}
