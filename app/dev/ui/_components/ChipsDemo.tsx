"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";

const initialFilters = ["Chevrolet", "Até R$ 60.000", "Sem leilão", "PE"];

export function ChipsDemo() {
  const [filters, setFilters] = useState(initialFilters);

  return (
    <div className="flex flex-wrap items-center gap-2">
      {filters.map((filter) => (
        <Chip
          key={filter}
          label={filter}
          onRemove={() => setFilters((current) => current.filter((item) => item !== filter))}
        />
      ))}
      {filters.length > 0 ? (
        <Button variant="ghost" size="sm" onClick={() => setFilters([])}>
          Limpar tudo
        </Button>
      ) : (
        <Button variant="secondary" size="sm" onClick={() => setFilters(initialFilters)}>
          Restaurar filtros
        </Button>
      )}
    </div>
  );
}
