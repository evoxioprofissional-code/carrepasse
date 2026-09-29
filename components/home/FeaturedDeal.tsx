"use client";

import { ArrowRight, MapPin } from "lucide-react";
import Link from "next/link";
import { ListingPhoto } from "@/components/listing/ListingPhoto";
import { Skeleton } from "@/components/ui/Skeleton";
import { useListings } from "@/hooks/useListings";
import { compareWithFipe, mainPrice } from "@/lib/fipe-math";
import { formatBRL, formatKm } from "@/lib/format";

/** Maior desconto entre os carros "limpos" (sem leilão e sem sinistro). */
export function FeaturedDeal() {
  const { data, loading } = useListings({
    sort: "maior-desconto",
    noAuction: true,
    noAccident: true,
    limit: 1,
  });
  const listing = data?.items[0];

  if (loading && !listing) {
    return <Skeleton className="aspect-[4/3] w-full rounded-2xl" />;
  }
  if (!listing) return null;

  const title = `${listing.brand} ${listing.model}`;
  const price = mainPrice(listing);
  const comparison = compareWithFipe(listing.fipePrice, price);

  return (
    <Link
      href={`/carros/${listing.id}`}
      className="group relative block overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl shadow-black/50 transition duration-150 hover:border-brand/60"
    >
      <div className="relative aspect-[4/3]">
        <ListingPhoto
          src={listing.photos[0]}
          alt={`${title} ${listing.version}`}
          sizes="(min-width: 1024px) 520px, 100vw"
          priority
          className="transition duration-300 group-hover:scale-[1.02]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
        <span className="absolute left-4 top-4 rounded-md bg-black/60 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-chrome backdrop-blur">
          Maior desconto agora
        </span>
        {comparison.kind === "below" && (
          <span className="absolute right-4 top-4 rounded-lg bg-brand-gradient px-3 py-1.5 font-display text-xl font-extrabold text-bg shadow-lg">
            -{comparison.percent}% FIPE
          </span>
        )}
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5">
          <div className="min-w-0">
            <p className="truncate font-display text-2xl font-bold uppercase text-white">{title}</p>
            <p className="truncate text-sm text-chrome">
              {listing.version} · {listing.modelYear} · {formatKm(listing.km)}
            </p>
            <p className="mt-1 flex items-center gap-1 text-xs text-chrome-muted">
              <MapPin aria-hidden className="size-3.5" />
              {listing.city}/{listing.state}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-xs text-chrome-muted line-through">FIPE {formatBRL(listing.fipePrice)}</p>
            <p className="font-display text-3xl font-bold text-brand">{formatBRL(price)}</p>
            <p className="inline-flex items-center gap-1 text-xs font-semibold text-chrome group-hover:text-brand">
              Ver anúncio <ArrowRight aria-hidden className="size-3.5" />
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
