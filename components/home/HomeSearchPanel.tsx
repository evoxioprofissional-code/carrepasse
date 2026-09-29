"use client";

import { Car, CircleDollarSign, MapPin, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Select } from "@/components/ui/Select";
import type { FilterOptions } from "@/repositories/listingRepository";
import { STATE_OPTIONS } from "@/lib/brazil";
import { formatBRL } from "@/lib/format";
import { searchHref, type SearchFilters } from "@/lib/listing-query";

const PRICE_OPTIONS = [30000, 40000, 50000, 60000, 80000, 100000, 150000, 200000].map((value) => ({
  value: String(value),
  label: `Até ${formatBRL(value)}`,
}));

interface HomeSearchPanelProps {
  options: FilterOptions | null;
  /** Filtros dos atalhos (chips) ativos, levados junto para a busca. */
  quickFilters: SearchFilters;
}

export function HomeSearchPanel({ options, quickFilters }: HomeSearchPanelProps) {
  const router = useRouter();
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [state, setState] = useState("");

  const modelsByBrand = useMemo(() => options?.modelsByBrand ?? {}, [options]);

  // Sem marca escolhida, lista todos os modelos; escolher um modelo define a marca.
  const modelOptions = useMemo(() => {
    const entries = brand
      ? (modelsByBrand[brand] ?? []).map((name) => ({ value: name, label: name }))
      : Object.entries(modelsByBrand)
          .flatMap(([brandName, models]) => models.map((name) => ({ value: name, label: `${brandName} ${name}` })))
          .sort((a, b) => a.label.localeCompare(b.label));
    return entries;
  }, [brand, modelsByBrand]);

  const brandOfModel = (name: string) =>
    Object.entries(modelsByBrand).find(([, models]) => models.includes(name))?.[0] ?? "";

  return (
    <form
      role="search"
      aria-label="Buscar carros"
      onSubmit={(event) => {
        event.preventDefault();
        router.push(
          searchHref({
            ...quickFilters,
            brand: brand || undefined,
            model: model || undefined,
            priceMax: priceMax ? Number(priceMax) : quickFilters.priceMax,
            state: state || undefined,
          }),
        );
      }}
      className="grid grid-cols-1 gap-3 rounded-[10px] bg-white p-4 shadow-[0_10px_30px_rgba(15,17,19,0.14)] sm:grid-cols-2 sm:gap-4 sm:p-5 lg:grid-cols-[repeat(4,minmax(0,1fr))_216px] lg:items-end lg:gap-5 lg:px-6 lg:py-5"
    >
      <Select
        tone="light"
        label="Marca"
        icon={<Car />}
        placeholder="Todas"
        options={(options?.brands ?? []).map(({ brand: name }) => ({ value: name, label: name }))}
        value={brand}
        onChange={(event) => {
          const next = event.target.value;
          setBrand(next);
          if (model && !(modelsByBrand[next] ?? []).includes(model)) setModel("");
        }}
        className="h-10"
      />
      <Select
        tone="light"
        label="Modelo"
        placeholder="Todos os modelos"
        options={modelOptions}
        value={model}
        onChange={(event) => {
          const next = event.target.value;
          setModel(next);
          if (next && !brand) setBrand(brandOfModel(next));
        }}
        className="h-10"
      />
      <Select
        tone="light"
        label="Até quanto?"
        icon={<CircleDollarSign />}
        placeholder="Qualquer valor"
        options={PRICE_OPTIONS}
        value={priceMax}
        onChange={(event) => setPriceMax(event.target.value)}
        className="h-10"
      />
      <Select
        tone="light"
        label="Localização"
        icon={<MapPin />}
        placeholder="Todo o Brasil"
        options={STATE_OPTIONS}
        value={state}
        onChange={(event) => setState(event.target.value)}
        className="h-10"
      />
      <button
        type="submit"
        className="flex h-11 items-center justify-center gap-2.5 rounded-md bg-lime text-[15px] font-semibold text-ink transition duration-150 hover:bg-lime-hover sm:col-span-2 lg:col-span-1"
      >
        <Search aria-hidden className="size-5" strokeWidth={2.5} />
        Buscar carros
      </button>
    </form>
  );
}
