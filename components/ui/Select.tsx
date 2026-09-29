"use client";

import { ChevronDown } from "lucide-react";
import { useId, type ComponentProps, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { describedBy, Field } from "./Field";
import { fieldStyles, type FieldTone } from "./fieldStyles";

export interface SelectOption {
  value: string;
  label: string;
}

type SelectProps = ComponentProps<"select"> & {
  label: string;
  options: SelectOption[];
  /** Primeira opção vazia, ex.: "Todas as marcas". */
  placeholder?: string;
  hint?: ReactNode;
  error?: string;
  containerClassName?: string;
  tone?: FieldTone;
  /** Ícone à esquerda do valor (tema claro da busca). */
  icon?: ReactNode;
};

export function Select({
  label,
  options,
  placeholder,
  hint,
  error,
  id,
  required,
  className,
  containerClassName,
  tone = "dark",
  icon,
  ...props
}: SelectProps) {
  const generatedId = useId();
  const selectId = id ?? generatedId;

  return (
    <Field
      id={selectId}
      label={label}
      hint={hint}
      error={error}
      required={required}
      className={containerClassName}
      tone={tone}
    >
      <div className="relative">
        {icon && (
          <span
            aria-hidden
            className={cn(
              "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 [&>svg]:size-[18px]",
              tone === "dark" ? "text-chrome-muted" : "text-ink-muted",
            )}
          >
            {icon}
          </span>
        )}
        <select
          id={selectId}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(selectId, error, hint)}
          className={fieldStyles(Boolean(error), cn("h-11 appearance-none pr-10", icon && "pl-10", className), tone)}
          {...props}
        >
          {placeholder !== undefined && <option value="">{placeholder}</option>}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden
          className={cn(
            "pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2",
            tone === "dark" ? "text-chrome-muted" : "text-ink",
          )}
        />
      </div>
    </Field>
  );
}
