"use client";

import { useId, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface RadioOption<T extends string> {
  value: T;
  label: string;
  description?: ReactNode;
  icon?: ReactNode;
}

interface RadioGroupProps<T extends string> {
  legend: string;
  /** Esconde a legenda visualmente (continua para leitor de tela). */
  hideLegend?: boolean;
  name?: string;
  options: RadioOption<T>[];
  value: T | undefined;
  onChange: (value: T) => void;
  /** "cards" para escolhas visuais (modalidade, tipo de vendedor). */
  variant?: "list" | "cards";
  error?: string;
  className?: string;
}

export function RadioGroup<T extends string>({
  legend,
  hideLegend = false,
  name,
  options,
  value,
  onChange,
  variant = "list",
  error,
  className,
}: RadioGroupProps<T>) {
  const generatedName = useId();
  const groupName = name ?? generatedName;
  const errorId = `${groupName}-error`;

  return (
    <fieldset
      aria-describedby={error ? errorId : undefined}
      className={cn("flex flex-col gap-2", className)}
    >
      <legend className={cn("mb-2 text-sm font-medium text-chrome", hideLegend && "sr-only")}>
        {legend}
      </legend>
      <div
        className={cn(
          variant === "list" && "flex flex-col gap-2",
          variant === "cards" && "grid gap-3 sm:grid-cols-[repeat(auto-fit,minmax(10rem,1fr))]",
        )}
      >
        {options.map((option) => {
          const checked = option.value === value;
          return (
            <label
              key={option.value}
              className={cn(
                "flex cursor-pointer gap-3 rounded-lg border p-3 transition duration-150 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand",
                variant === "cards" && "flex-col rounded-xl p-4",
                checked
                  ? "border-brand bg-brand/5"
                  : "border-border bg-surface-2 hover:border-chrome-muted/50",
              )}
            >
              <input
                type="radio"
                name={groupName}
                value={option.value}
                checked={checked}
                onChange={() => onChange(option.value)}
                className="sr-only"
              />
              {variant === "list" && (
                <span
                  aria-hidden
                  className={cn(
                    "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border",
                    checked ? "border-brand" : "border-chrome-muted/50",
                  )}
                >
                  {checked && <span className="size-2.5 rounded-full bg-brand" />}
                </span>
              )}
              {variant === "cards" && option.icon && (
                <span
                  aria-hidden
                  className={cn("[&>svg]:size-6", checked ? "text-brand" : "text-chrome-muted")}
                >
                  {option.icon}
                </span>
              )}
              <span className="flex flex-col gap-0.5">
                <span className="text-sm font-semibold text-chrome">{option.label}</span>
                {option.description && (
                  <span className="text-xs leading-relaxed text-chrome-muted">
                    {option.description}
                  </span>
                )}
              </span>
            </label>
          );
        })}
      </div>
      {error && (
        <p id={errorId} role="alert" className="text-xs text-danger">
          {error}
        </p>
      )}
    </fieldset>
  );
}
