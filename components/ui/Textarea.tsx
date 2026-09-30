"use client";

import { useId, type ComponentProps, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { describedBy, Field } from "./Field";
import { fieldStyles } from "./fieldStyles";

type TextareaProps = ComponentProps<"textarea"> & {
  label: string;
  hint?: ReactNode;
  error?: string;
  /** Mostra "120/80" ao lado do label quando informado. */
  minChars?: number;
  containerClassName?: string;
};

export function Textarea({
  label,
  hint,
  error,
  minChars,
  id,
  required,
  className,
  containerClassName,
  value,
  ...props
}: TextareaProps) {
  const generatedId = useId();
  const textareaId = id ?? generatedId;
  const length = typeof value === "string" ? value.length : 0;
  const reachedMin = minChars !== undefined && length >= minChars;

  return (
    <Field
      id={textareaId}
      label={label}
      hint={hint}
      error={error}
      required={required}
      className={containerClassName}
      aside={
        minChars !== undefined && (
          <span className={reachedMin ? "text-lime-ink" : undefined}>
            {length}/{minChars} mín.
          </span>
        )
      }
    >
      <textarea
        id={textareaId}
        required={required}
        value={value}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(textareaId, error, hint)}
        className={fieldStyles(Boolean(error), cn("min-h-32 resize-y py-2.5", className))}
        {...props}
      />
    </Field>
  );
}
