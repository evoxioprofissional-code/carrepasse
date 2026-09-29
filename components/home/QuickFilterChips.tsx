"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/cn";
import type { SearchFilters } from "@/lib/listing-query";

export interface QuickFilter {
  id: string;
  label: string;
  filters: SearchFilters;
}

export const QUICK_FILTERS: QuickFilter[] = [
  { id: "ate-50", label: "Até R$ 50 mil", filters: { priceMax: 50000 } },
  { id: "suv", label: "SUVs", filters: { bodyType: "suv" } },
  { id: "automaticos", label: "Automáticos", filters: { automatic: true } },
  { id: "picapes", label: "Picapes", filters: { bodyType: "picape" } },
  { id: "abaixo-fipe", label: "Abaixo da FIPE", filters: { belowFipe: true } },
];

/** Um atalho está ativo quando todos os seus filtros batem com os atuais. */
export function isQuickFilterActive(chip: QuickFilter, current: SearchFilters): boolean {
  return (Object.keys(chip.filters) as (keyof SearchFilters)[]).every((key) => current[key] === chip.filters[key]);
}

interface QuickFilterChipsProps {
  value: SearchFilters;
  onChange: (next: SearchFilters) => void;
}

export function QuickFilterChips({ value, onChange }: QuickFilterChipsProps) {
  const toggle = (chip: QuickFilter) => {
    if (isQuickFilterActive(chip, value)) {
      const next = { ...value };
      (Object.keys(chip.filters) as (keyof SearchFilters)[]).forEach((key) => delete next[key]);
      onChange(next);
    } else {
      // SUVs e Picapes usam o mesmo campo: ligar um substitui o outro.
      onChange({ ...value, ...chip.filters });
    }
  };

  return (
    <ul
      aria-label="Filtros rápidos"
      className="scrollbar-none -mx-4 flex gap-2.5 overflow-x-auto px-4 py-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
    >
      {QUICK_FILTERS.map((chip) => {
        const active = isQuickFilterActive(chip, value);
        return (
          <li key={chip.id} className="shrink-0">
            <button
              type="button"
              aria-pressed={active}
              onClick={() => toggle(chip)}
              className={cn(
                "inline-flex h-10 items-center sm:h-[34px] gap-1.5 rounded-full border px-4 text-sm font-medium transition duration-150",
                active
                  ? "border-lime-ink bg-lime-soft text-lime-ink"
                  : "border-line bg-white text-ink hover:border-ink-muted/60",
              )}
            >
              {active && <Check aria-hidden className="size-4" strokeWidth={2.5} />}
              {chip.label}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
