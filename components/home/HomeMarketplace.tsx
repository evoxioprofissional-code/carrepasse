"use client";

import { SearchX } from "lucide-react";
import { useState } from "react";
import { VehicleCard } from "@/components/listing/VehicleCard";
import { VehicleCardSkeleton } from "@/components/listing/VehicleCardSkeleton";
import { Container } from "@/components/ui/Container";
import { useFilterOptions } from "@/hooks/useFilterOptions";
import { useListings } from "@/hooks/useListings";
import { cn } from "@/lib/cn";
import type { SearchFilters } from "@/lib/listing-query";
import type { ListingSort } from "@/types/listing";
import { HomeSearchPanel } from "./HomeSearchPanel";
import { InfoStrip } from "./InfoStrip";
import { QuickFilterChips } from "./QuickFilterChips";
import { SortSelect } from "./SortSelect";

const PAGE_SIZE = 12;

/**
 * Busca + atalhos + listagem da home. Os atalhos filtram a própria grade;
 * o botão "Buscar carros" leva tudo para /carros.
 */
export function HomeMarketplace() {
  const [quickFilters, setQuickFilters] = useState<SearchFilters>({});
  const [sort, setSort] = useState<ListingSort>("recentes");
  const [limit, setLimit] = useState(PAGE_SIZE);
  const options = useFilterOptions();
  const { data, loading, error, reload } = useListings({ ...quickFilters, sort, limit });

  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const firstLoad = loading && !data;

  const changeFilters = (next: SearchFilters) => {
    setQuickFilters(next);
    setLimit(PAGE_SIZE);
  };

  return (
    <div className="bg-paper">
      <Container className="relative z-10 -mt-[60px] lg:-mt-[54px]">
        <HomeSearchPanel options={options} quickFilters={{ ...quickFilters, sort }} />
        <div className="mt-4">
          <QuickFilterChips value={quickFilters} onChange={changeFilters} />
        </div>
      </Container>

      <Container className="pb-12 pt-8 lg:pt-10">
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-[26px] font-extrabold leading-tight tracking-tight text-ink sm:text-[32px]">
              Encontre seu próximo carro
            </h2>
            <p className="mt-1 text-base text-ink-muted" aria-live="polite">
              {firstLoad ? "Carregando anúncios…" : `${total} ${total === 1 ? "anúncio disponível" : "anúncios disponíveis"}`}
            </p>
          </div>
          <SortSelect
            value={sort}
            onChange={(next) => {
              setSort(next);
              setLimit(PAGE_SIZE);
            }}
          />
        </div>

        {error && (
          <div role="alert" className="mb-5 rounded-[10px] border border-danger/30 bg-white p-4 text-sm text-ink">
            {error}{" "}
            <button type="button" onClick={reload} className="font-semibold text-lime-ink underline">
              Tentar de novo
            </button>
          </div>
        )}

        {!error && !loading && items.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-[10px] border border-dashed border-line bg-white px-6 py-14 text-center">
            <SearchX aria-hidden className="size-10 text-ink-muted" />
            <p className="text-lg font-bold text-ink">Nenhum carro com esses filtros</p>
            <p className="max-w-sm text-sm text-ink-muted">Desmarque algum atalho para ver mais anúncios.</p>
            <button
              type="button"
              onClick={() => changeFilters({})}
              className="mt-1 h-10 rounded-md border border-lime px-5 text-sm font-semibold text-lime-ink hover:bg-lime-soft"
            >
              Limpar filtros
            </button>
          </div>
        ) : (
          <ul
            className={cn(
              "grid grid-cols-1 gap-[18px] transition-opacity sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
              loading && !firstLoad && "opacity-60",
            )}
          >
            {firstLoad
              ? Array.from({ length: 8 }, (_, index) => (
                  <li key={index} style={{ order: (index + 1) * 2 }}>
                    <VehicleCardSkeleton />
                  </li>
                ))
              : items.map((listing, index) => (
                  <li key={listing.id} className="flex" style={{ order: (index + 1) * 2 }}>
                    <VehicleCard listing={listing} priority={index < 4} className="w-full" />
                  </li>
                ))}
            {/* Faixa informativa logo depois da primeira linha, qualquer que seja o nº de colunas */}
            <li className="order-[3] col-span-full sm:order-[5] lg:order-[7] xl:order-[9]">
              <InfoStrip />
            </li>
          </ul>
        )}

        {data?.hasMore && (
          <div className="mt-10 flex flex-col items-center gap-2">
            <button
              type="button"
              disabled={loading}
              onClick={() => setLimit((value) => value + PAGE_SIZE)}
              className="h-11 rounded-md border border-lime bg-white px-8 text-[15px] font-semibold text-lime-ink transition duration-150 hover:bg-lime-soft disabled:opacity-60"
            >
              {loading ? "Carregando…" : "Carregar mais carros"}
            </button>
            <p className="text-xs text-ink-muted">
              Mostrando {items.length} de {total}
            </p>
          </div>
        )}
      </Container>
    </div>
  );
}
