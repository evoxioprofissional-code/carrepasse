"use client";

import { Check } from "lucide-react";
import { useId, type ComponentProps, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type CheckboxProps = Omit<ComponentProps<"input">, "type"> & {
  label: ReactNode;
  description?: ReactNode;
  error?: string;
};

export function Checkbox({ label, description, error, id, className, ...props }: CheckboxProps) {
  const generatedId = useId();
  const checkboxId = id ?? generatedId;
  const descriptionId = description ? `${checkboxId}-desc` : undefined;
  const errorId = error ? `${checkboxId}-error` : undefined;

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <label htmlFor={checkboxId} className="group flex cursor-pointer items-start gap-3">
        <span className="relative mt-0.5 flex size-5 shrink-0">
          <input
            id={checkboxId}
            type="checkbox"
            aria-describedby={[descriptionId, errorId].filter(Boolean).join(" ") || undefined}
            aria-invalid={error ? true : undefined}
            className={cn(
              "peer size-5 cursor-pointer appearance-none rounded-md border bg-white transition duration-150",
              "checked:border-lime-ink checked:bg-lime group-hover:border-chrome-muted/60",
              error ? "border-danger" : "border-border",
            )}
            {...props}
          />
          <Check
            aria-hidden
            strokeWidth={3}
            className="pointer-events-none absolute inset-0.5 hidden size-4 text-ink peer-checked:block"
          />
        </span>
        <span className="flex flex-col gap-0.5">
          <span className="text-sm text-chrome">{label}</span>
          {description && (
            <span id={descriptionId} className="text-xs text-chrome-muted">
              {description}
            </span>
          )}
        </span>
      </label>
      {error && (
        <p id={errorId} role="alert" className="pl-8 text-xs text-danger-ink">
          {error}
        </p>
      )}
    </div>
  );
}
