"use client";

import Link from "next/link";
import { ListingPhoto } from "@/components/listing/ListingPhoto";
import { Skeleton } from "@/components/ui/Skeleton";
import { Container } from "@/components/ui/Container";
import { useFilterOptions } from "@/hooks/useFilterOptions";
import { illustrationPath } from "@/lib/car-illustration";
import { BODY_TYPE_LABEL } from "@/lib/labels";
import { searchHref } from "@/lib/listing-query";
import type { BodyType } from "@/types/listing";
import { SectionHeader } from "./SectionHeader";

const BODY_TILES: { bodyType: BodyType; hint: string }[] = [
  { bodyType: "hatch", hint: "Econômicos para o dia a dia" },
  { bodyType: "sedan", hint: "Porta-malas grande e conforto" },
  { bodyType: "suv", hint: "Altos, espaçosos e valorizados" },
  { bodyType: "picape", hint: "Para trabalho e estrada" },
];

export function BrowseShortcuts() {
  const options = useFilterOptions();

  return (
    <section className="border-y border-border bg-surface/40 py-12 lg:py-16">
      <Container className="flex flex-col gap-12">
        <div>
          <SectionHeader title="Procure pelo tipo de carro" />
          <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
            {BODY_TILES.map(({ bodyType, hint }) => (
              <li key={bodyType}>
                <Link
                  href={searchHref({ bodyType })}
                  className="group block overflow-hidden rounded-xl border border-border bg-surface transition duration-150 hover:border-brand/60"
                >
                  <div className="relative aspect-[16/10]">
                    <ListingPhoto
                      src={illustrationPath(bodyType, "prata", 1)}
                      alt=""
                      sizes="(min-width: 1024px) 300px, 50vw"
                      className="transition duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-3 sm:p-4">
                    <p className="font-display text-lg font-bold text-chrome group-hover:text-brand">
                      {BODY_TYPE_LABEL[bodyType]}
                    </p>
                    <p className="hidden text-sm text-chrome-muted sm:block">{hint}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <SectionHeader title="Marcas mais anunciadas" />
          {options ? (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
              {options.brands.map(({ brand, count }) => (
                <li key={brand}>
                  <Link
                    href={searchHref({ brand })}
                    className="flex h-full flex-col items-center justify-center gap-0.5 rounded-xl border border-border bg-surface px-3 py-4 text-center transition duration-150 hover:border-brand/60"
                  >
                    <span className="font-display text-base font-bold text-chrome">{brand}</span>
                    <span className="text-xs text-chrome-muted">
                      {count} {count === 1 ? "carro" : "carros"}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
              {Array.from({ length: 8 }, (_, index) => (
                <Skeleton key={index} className="h-[70px] rounded-xl" />
              ))}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
