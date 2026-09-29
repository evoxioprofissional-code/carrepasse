"use client";

import { Select } from "@/components/ui/Select";
import { Switch } from "@/components/ui/Switch";
import type { FilterOptions } from "@/repositories/listingRepository";
import { STATE_OPTIONS } from "@/lib/brazil";
import { formatBRL, formatKm } from "@/lib/format";
import {
  BODY_TYPE_LABEL,
  FUEL_LABEL,
  SELLER_TYPE_LABEL,
  TRANSMISSION_LABEL,
  optionsFrom,
} from "@/lib/labels";
import type { SearchFilters } from "@/lib/listing-query";
import { FilterGroup } from "./FilterGroup";

interface FiltersPanelProps {
  filters: SearchFilters;
  options: FilterOptions | null;
  onChange: (patch: Partial<SearchFilters>) => void;
}

const PRICE_STEPS = [20000, 30000, 40000, 50000, 60000, 70000, 80000, 100000, 120000, 150000, 200000];
const KM_STEPS = [20000, 40000, 60000, 80000, 100000, 150000];
const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: CURRENT_YEAR - 2008 + 1 }, (_, index) => CURRENT_YEAR - index);

const priceOptions = PRICE_STEPS.map((value) => ({ value: String(value), label: formatBRL(value) }));
const yearOptions = YEARS.map((year) => ({ value: String(year), label: String(year) }));
const kmOptions = KM_STEPS.map((value) => ({ value: String(value), label: `Até ${formatKm(value)}` }));

function toNumber(value: string): number | undefined {
  return value ? Number(value) : undefined;
}

function toOptional<T extends string>(value: string): T | undefined {
  return value ? (value as T) : undefined;
}

/** Painel de filtros; o mesmo conteúdo vai na sidebar (desktop) e no drawer (mobile). */
export function FiltersPanel({ filters, options, onChange }: FiltersPanelProps) {
  const brandOptions = (options?.brands ?? []).map(({ brand, count }) => ({
    value: brand,
    label: `${brand} (${count})`,
  }));
  const cityOptions = (filters.state ? (options?.citiesByState[filters.state] ?? []) : []).map(
    (city) => ({ value: city, label: city }),
  );
  const modelOptions = (filters.brand ? (options?.modelsByBrand[filters.brand] ?? []) : []).map(
    (model) => ({ value: model, label: model }),
  );

  return (
    <div className="flex flex-col gap-5">
      <FilterGroup title="Carro">
        <Select
          label="Marca"
          placeholder="Todas"
          options={brandOptions}
          value={filters.brand ?? ""}
          onChange={(event) => onChange({ brand: toOptional(event.target.value), model: undefined })}
        />
        <Select
          label="Modelo"
          placeholder={filters.brand ? "Todos" : "Escolha a marca"}
          options={modelOptions}
          disabled={!filters.brand}
          value={filters.model ?? ""}
          onChange={(event) => onChange({ model: toOptional(event.target.value) })}
        />
        <Select
          label="Carroceria"
          placeholder="Todas"
          options={optionsFrom(BODY_TYPE_LABEL)}
          value={filters.bodyType ?? ""}
          onChange={(event) => onChange({ bodyType: toOptional(event.target.value) })}
        />
        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Ano de"
            placeholder="Qualquer"
            options={yearOptions}
            value={filters.yearMin ? String(filters.yearMin) : ""}
            onChange={(event) => onChange({ yearMin: toNumber(event.target.value) })}
          />
          <Select
            label="Ano até"
            placeholder="Qualquer"
            options={yearOptions}
            value={filters.yearMax ? String(filters.yearMax) : ""}
            onChange={(event) => onChange({ yearMax: toNumber(event.target.value) })}
          />
        </div>
      </FilterGroup>

      <FilterGroup title="Preço e uso">
        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Preço mín."
            placeholder="R$ 0"
            options={priceOptions}
            value={filters.priceMin ? String(filters.priceMin) : ""}
            onChange={(event) => onChange({ priceMin: toNumber(event.target.value) })}
          />
          <Select
            label="Preço máx."
            placeholder="Qualquer"
            options={priceOptions}
            value={filters.priceMax ? String(filters.priceMax) : ""}
            onChange={(event) => onChange({ priceMax: toNumber(event.target.value) })}
          />
        </div>
        <Select
          label="Quilometragem"
          placeholder="Qualquer km"
          options={kmOptions}
          value={filters.kmMax ? String(filters.kmMax) : ""}
          onChange={(event) => onChange({ kmMax: toNumber(event.target.value) })}
        />
        <Select
          label="Modalidade"
          placeholder="Repasse e preço final"
          options={[
            { value: "repasse", label: "Repasse" },
            { value: "final", label: "Preço final" },
          ]}
          value={filters.priceMode ?? ""}
          onChange={(event) => onChange({ priceMode: toOptional(event.target.value) })}
        />
      </FilterGroup>

      <FilterGroup title="Transparência">
        <Switch
          label="Sem leilão"
          checked={Boolean(filters.noAuction)}
          onCheckedChange={(checked) => onChange({ noAuction: checked || undefined })}
        />
        <Switch
          label="Sem sinistro"
          checked={Boolean(filters.noAccident)}
          onCheckedChange={(checked) => onChange({ noAccident: checked || undefined })}
        />
      </FilterGroup>

      <FilterGroup title="Local e vendedor">
        <Select
          label="Estado"
          placeholder="Todo o Brasil"
          options={STATE_OPTIONS}
          value={filters.state ?? ""}
          onChange={(event) => onChange({ state: toOptional(event.target.value), city: undefined })}
        />
        <Select
          label="Cidade"
          placeholder={filters.state ? "Todas" : "Escolha o estado"}
          options={cityOptions}
          disabled={!filters.state}
          value={filters.city ?? ""}
          onChange={(event) => onChange({ city: toOptional(event.target.value) })}
        />
        <Select
          label="Tipo de vendedor"
          placeholder="Todos"
          options={optionsFrom(SELLER_TYPE_LABEL)}
          value={filters.sellerType ?? ""}
          onChange={(event) => onChange({ sellerType: toOptional(event.target.value) })}
        />
      </FilterGroup>

      <FilterGroup title="Mecânica">
        <Select
          label="Câmbio"
          placeholder="Todos"
          options={optionsFrom(TRANSMISSION_LABEL)}
          value={filters.transmission ?? ""}
          onChange={(event) => onChange({ transmission: toOptional(event.target.value) })}
        />
        <Select
          label="Combustível"
          placeholder="Todos"
          options={optionsFrom(FUEL_LABEL)}
          value={filters.fuel ?? ""}
          onChange={(event) => onChange({ fuel: toOptional(event.target.value) })}
        />
      </FilterGroup>
    </div>
  );
}
