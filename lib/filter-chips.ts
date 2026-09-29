import { formatBRLShort, formatKm } from "./format";
import {
  BODY_TYPE_LABEL,
  FUEL_LABEL,
  SELLER_TYPE_LABEL,
  TRANSMISSION_LABEL,
} from "./labels";
import type { SearchFilters } from "./listing-query";

export interface FilterChip {
  label: string;
  /** Campos zerados ao remover o chip. */
  clear: Partial<SearchFilters>;
}

/** Filtros ativos em forma de chips removíveis ("Até R$ 50 mil", "Sem leilão"...). */
export function filterChips(filters: SearchFilters): FilterChip[] {
  const chips: FilterChip[] = [];
  const add = (label: string, clear: Partial<SearchFilters>) => chips.push({ label, clear });

  if (filters.text) add(`"${filters.text}"`, { text: undefined });
  if (filters.brand) add(filters.brand, { brand: undefined, model: undefined });
  if (filters.model) add(filters.model, { model: undefined });
  if (filters.bodyType) add(BODY_TYPE_LABEL[filters.bodyType], { bodyType: undefined });
  if (filters.yearMin && filters.yearMax) {
    add(`${filters.yearMin} a ${filters.yearMax}`, { yearMin: undefined, yearMax: undefined });
  } else if (filters.yearMin) {
    add(`A partir de ${filters.yearMin}`, { yearMin: undefined });
  } else if (filters.yearMax) {
    add(`Até ${filters.yearMax}`, { yearMax: undefined });
  }
  if (filters.priceMin) add(`A partir de ${formatBRLShort(filters.priceMin)}`, { priceMin: undefined });
  if (filters.priceMax) add(`Até ${formatBRLShort(filters.priceMax)}`, { priceMax: undefined });
  if (filters.kmMax) add(`Até ${formatKm(filters.kmMax)}`, { kmMax: undefined });
  if (filters.priceMode) add(filters.priceMode === "repasse" ? "Repasse" : "Preço final", { priceMode: undefined });
  if (filters.noAuction) add("Sem leilão", { noAuction: undefined });
  if (filters.noAccident) add("Sem sinistro", { noAccident: undefined });
  if (filters.state) add(filters.state, { state: undefined, city: undefined });
  if (filters.city) add(filters.city, { city: undefined });
  if (filters.sellerType) add(SELLER_TYPE_LABEL[filters.sellerType], { sellerType: undefined });
  if (filters.transmission) add(TRANSMISSION_LABEL[filters.transmission], { transmission: undefined });
  if (filters.fuel) add(FUEL_LABEL[filters.fuel], { fuel: undefined });

  return chips;
}
