"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { useFilterOptions } from "@/hooks/useFilterOptions";
import { STATE_OPTIONS } from "@/lib/brazil";
import { formatBRL } from "@/lib/format";
import { searchHref } from "@/lib/listing-query";

const PRICE_OPTIONS = [30000, 40000, 50000, 60000, 80000, 100000, 150000].map((value) => ({
  value: String(value),
  label: `Até ${formatBRL(value)}`,
}));

export function HeroSearch() {
  const router = useRouter();
  const options = useFilterOptions();
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [state, setState] = useState("");

  const brandOptions = (options?.brands ?? []).map(({ brand: name, count }) => ({
    value: name,
    label: `${name} (${count})`,
  }));
  const modelOptions = (brand ? (options?.modelsByBrand[brand] ?? []) : []).map((name) => ({
    value: name,
    label: name,
  }));

  return (
    <form
      role="search"
      aria-label="Buscar carros"
      onSubmit={(event) => {
        event.preventDefault();
        router.push(
          searchHref({
            brand: brand || undefined,
            model: model || undefined,
            priceMax: priceMax ? Number(priceMax) : undefined,
            state: state || undefined,
          }),
        );
      }}
      className="rounded-2xl border border-border bg-surface/90 p-4 shadow-2xl shadow-black/40 backdrop-blur sm:p-5"
    >
      <div className="grid grid-cols-2 gap-3">
        <Select
          label="Marca"
          placeholder="Todas"
          options={brandOptions}
          value={brand}
          onChange={(event) => {
            setBrand(event.target.value);
            setModel("");
          }}
        />
        <Select
          label="Modelo"
          placeholder={brand ? "Todos" : "Escolha a marca"}
          options={modelOptions}
          value={model}
          disabled={!brand}
          onChange={(event) => setModel(event.target.value)}
        />
        <Select
          label="Preço máximo"
          placeholder="Qualquer"
          options={PRICE_OPTIONS}
          value={priceMax}
          onChange={(event) => setPriceMax(event.target.value)}
        />
        <Select
          label="Estado"
          placeholder="Todo o Brasil"
          options={STATE_OPTIONS}
          value={state}
          onChange={(event) => setState(event.target.value)}
        />
      </div>
      <Button type="submit" size="lg" fullWidth className="mt-4">
        <Search aria-hidden className="size-5" />
        {options ? `Buscar entre ${options.total} carros` : "Buscar carros"}
      </Button>
    </form>
  );
}
