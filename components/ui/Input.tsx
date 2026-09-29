"use client";

import { useId, type ComponentProps, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { describedBy, Field } from "./Field";
import { fieldStyles } from "./fieldStyles";

type InputProps = Omit<ComponentProps<"input">, "prefix"> & {
  label: string;
  hint?: ReactNode;
  error?: string;
  /** Texto fixo antes do valor, ex.: "R$". */
  prefix?: string;
  /** Texto fixo depois do valor, ex.: "km". */
  suffix?: string;
  containerClassName?: string;
};

export function Input({
  label,
  hint,
  error,
  prefix,
  suffix,
  id,
  required,
  className,
  containerClassName,
  ...props
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <Field
      id={inputId}
      label={label}
      hint={hint}
      error={error}
      required={required}
      className={containerClassName}
    >
      <div className="relative">
        {prefix && (
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-chrome-muted">
            {prefix}
          </span>
        )}
        <input
          id={inputId}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(inputId, error, hint)}
          className={fieldStyles(
            Boolean(error),
            cn("h-11", prefix && "pl-10", suffix && "pr-12", className),
          )}
          {...props}
        />
        {suffix && (
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-chrome-muted">
            {suffix}
          </span>
        )}
      </div>
    </Field>
  );
}
