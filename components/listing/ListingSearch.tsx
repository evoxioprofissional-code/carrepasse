"use client";

import { SearchX, SlidersHorizontal } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { Skeleton } from "@/components/ui/Skeleton";
import { useFilterOptions } from "@/hooks/useFilterOptions";
import { useListings } from "@/hooks/useListings";
import { cn } from "@/lib/cn";
import { filterChips } from "@/lib/filter-chips";
import { SORT_LABEL, optionsFrom } from "@/lib/labels";
import {
  countActiveFilters,
  parseSearchFilters,
  serializeSearchFilters,
  type SearchFilters,
} from "@/lib/listing-query";
import type { ListingSort } from "@/types/listing";
import { FiltersPanel } from "./FiltersPanel";
import { ListingCard } from "./ListingCard";
import { ListingCardSkeleton } from "./ListingCardSkeleton";

const PAGE_SIZE = 12;

export function ListingSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const filters = useMemo(() => parseSearchFilters(searchParams), [searchParams]);
  const filtersKey = serializeSearchFilters(filters);

  // "Carregar mais" volta para 12 sempre que os filtros mudam.
  const [pageState, setPageState] = useState({ key: filtersKey, limit: PAGE_SIZE });
  const limit = pageState.key === filtersKey ? pageState.limit : PAGE_SIZE;
  const [drawerOpen, setDrawerOpen] = useState(false);

  const options = useFilterOptions();
  const { data, loading, error, reload } = useListings({ ...filters, limit });

  const updateFilters = useCallback(
    (patch: Partial<SearchFilters>) => {
      const qs = serializeSearchFilters({ ...filters, ...patch });
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [filters, pathname, router],
  );

  const clearAll = () => router.replace(pathname, { scroll: false });
  const chips = filterChips(filters);
  const activeCount = countActiveFilters(filters);
  const items = data?.items ?? [];
  const firstLoad = loading && !data;

  const sortSelect = (
    <Select
      label="Ordenar por"
      options={optionsFrom(SORT_LABEL)}
      value={filters.sort ?? "recentes"}
      onChange={(event) => updateFilters({ sort: event.target.value as ListingSort })}
      containerClassName="w-full sm:w-60"
    />
  );

  return (
    <Container className="py-6 lg:py-10">
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl text-chrome sm:text-4xl">
            {filters.brand ? `${filters.brand}${filters.model ? ` ${filters.model}` : ""} à venda` : "Carros à venda"}
          </h1>
          <div className="mt-1 text-sm text-chrome-muted" aria-live="polite">
            {firstLoad ? (
              <Skeleton className="inline-block h-4 w-40 align-middle" />
            ) : (
              <>
                <strong className="text-chrome">{data?.total ?? 0}</strong>{" "}
                {data?.total === 1 ? "carro encontrado" : "carros encontrados"}
              </>
            )}
          </div>
        </div>
        <div className="hidden sm:block">{sortSelect}</div>
      </header>

      {/* Barra mobile: filtros + ordenação */}
      <div className="sticky top-[calc(3.5rem+env(safe-area-inset-top))] z-30 -mx-4 mb-4 flex items-end gap-3 border-b border-border bg-bg/95 px-4 pb-3 pt-1 backdrop-blur lg:hidden">
        <Button variant="secondary" className="h-11 shrink-0" onClick={() => setDrawerOpen(true)}>
          <SlidersHorizontal aria-hidden className="size-4" />
          Filtros{activeCount > 0 && ` (${activeCount})`}
        </Button>
        <div className="flex-1 sm:hidden">{sortSelect}</div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
        <aside aria-label="Filtros" className="hidden lg:block">
          <div className="sticky top-24 max-h-[calc(100dvh-7rem)] overflow-y-auto rounded-xl border border-border bg-surface p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg text-chrome">Filtros</h2>
              {activeCount > 0 && (
                <button
                  type="button"
                  onClick={clearAll}
                  className="rounded text-sm font-medium text-brand hover:text-brand-dark"
                >
                  Limpar
                </button>
              )}
            </div>
            <FiltersPanel filters={filters} options={options} onChange={updateFilters} />
          </div>
        </aside>

        <div className="min-w-0">
          {chips.length > 0 && (
            <div className="mb-5 flex flex-wrap items-center gap-2">
              {chips.map((chip) => (
                <Chip key={chip.label} label={chip.label} onRemove={() => updateFilters(chip.clear)} />
              ))}
              <Button variant="ghost" size="sm" onClick={clearAll}>
                Limpar tudo
              </Button>
            </div>
          )}

          {error && (
            <Alert variant="danger" title="Algo deu errado">
              {error}{" "}
              <button type="button" onClick={reload} className="font-semibold text-chrome underline">
                Tentar de novo
              </button>
            </Alert>
          )}

          {!error && !loading && items.length === 0 ? (
            <EmptyState
              icon={<SearchX aria-hidden />}
              title="Nenhum carro com esses filtros"
              description="Tente aumentar o preço máximo, tirar a cidade ou buscar em todo o Brasil."
              action={
                <Button variant="secondary" onClick={clearAll}>
                  Limpar filtros
                </Button>
              }
            />
          ) : (
            <ul className={cn("grid gap-4 transition-opacity sm:grid-cols-2 xl:grid-cols-3", loading && !firstLoad && "opacity-60")}>
              {firstLoad
                ? Array.from({ length: 6 }, (_, index) => (
                    <li key={index}>
                      <ListingCardSkeleton />
                    </li>
                  ))
                : items.map((listing, index) => (
                    <li key={listing.id} className="flex">
                      <ListingCard listing={listing} priority={index < 3} className="w-full" />
                    </li>
                  ))}
            </ul>
          )}

          {data?.hasMore && (
            <div className="mt-8 flex flex-col items-center gap-2">
              <Button
                variant="secondary"
                size="lg"
                loading={loading}
                onClick={() => setPageState({ key: filtersKey, limit: limit + PAGE_SIZE })}
              >
                Carregar mais carros
              </Button>
              <p className="text-xs text-chrome-muted">
                Mostrando {items.length} de {data.total}
              </p>
            </div>
          )}
        </div>
      </div>

      <Modal
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        variant="sheet"
        title="Filtros"
        footer={
          <>
            {activeCount > 0 && (
              <Button variant="ghost" onClick={clearAll}>
                Limpar tudo
              </Button>
            )}
            <Button onClick={() => setDrawerOpen(false)} className="sm:min-w-48">
              {loading ? "Buscando..." : `Ver ${data?.total ?? 0} carros`}
            </Button>
          </>
        }
      >
        <FiltersPanel filters={filters} options={options} onChange={updateFilters} />
      </Modal>
    </Container>
  );
}
