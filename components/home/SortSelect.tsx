"use client";

import { ChevronDown } from "lucide-react";
import { SORT_LABEL, optionsFrom } from "@/lib/labels";
import type { ListingSort } from "@/types/listing";

interface SortSelectProps {
  value: ListingSort;
  onChange: (value: ListingSort) => void;
}

/** "Ordenar por" com o rótulo ao lado do campo, como na vitrine. */
export function SortSelect({ value, onChange }: SortSelectProps) {
  return (
    <div className="flex items-center gap-3">
      <label htmlFor="home-sort" className="shrink-0 text-sm text-ink-muted">
        Ordenar por
      </label>
      <div className="relative">
        <select
          id="home-sort"
          value={value}
          onChange={(event) => onChange(event.target.value as ListingSort)}
          className="h-10 w-full min-w-[160px] appearance-none rounded-md border border-line bg-white pl-3 pr-10 text-sm text-ink transition duration-150 hover:border-ink-muted/50 focus-visible:border-lime-ink focus-visible:ring-1 focus-visible:ring-lime-ink focus-visible:ring-offset-0"
        >
          {optionsFrom(SORT_LABEL).map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden
          className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-ink"
        />
      </div>
    </div>
  );
}
