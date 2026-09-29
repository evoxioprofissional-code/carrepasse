import { Camera, Gavel, MapPin, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/cn";
import { compareWithFipe, mainPrice } from "@/lib/fipe-math";
import { formatBRL, formatKm, formatYears } from "@/lib/format";
import { SELLER_TYPE_LABEL } from "@/lib/labels";
import type { ListingWithSeller } from "@/types/listing";
import { FavoriteButton } from "./FavoriteButton";
import { ListingPhoto } from "./ListingPhoto";

interface ListingCardProps {
  listing: ListingWithSeller;
  priority?: boolean;
  className?: string;
}

export function ListingCard({ listing, priority, className }: ListingCardProps) {
  const title = `${listing.brand} ${listing.model}`;
  const price = mainPrice(listing);
  const comparison = compareWithFipe(listing.fipePrice, price);
  const priceLabel = listing.repassePrice !== undefined ? "Repasse" : "Preço final";
  const sold = listing.status === "vendido";

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl border border-border bg-surface transition duration-150 hover:border-brand/60 hover:bg-[#171717] has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-brand",
        sold && "opacity-60",
        className,
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-surface-2">
        <ListingPhoto
          src={listing.photos[0]}
          alt={`${title} ${listing.version}, ${listing.color}`}
          sizes="(min-width: 1280px) 300px, (min-width: 640px) 45vw, 100vw"
          priority={priority}
          className="transition duration-300 group-hover:scale-[1.03]"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 to-transparent" />

        {comparison.kind === "below" && (
          <Badge variant="discount" className="absolute left-3 top-3 px-2.5 py-1 text-sm shadow-lg shadow-black/30">
            -{comparison.percent}% FIPE
          </Badge>
        )}
        {sold && (
          <Badge variant="neutral" className="absolute left-3 top-3 bg-black/70 text-sm text-chrome">
            Vendido
          </Badge>
        )}

        <FavoriteButton listingId={listing.id} listingTitle={title} className="absolute right-3 top-3 z-10" />

        <span className="absolute bottom-2.5 left-3 inline-flex items-center gap-1 text-xs font-medium text-white">
          <Camera aria-hidden className="size-3.5" />
          {listing.photos.length}
        </span>
        <span className="absolute bottom-2.5 right-3 rounded bg-black/60 px-1.5 py-0.5 text-[0.7rem] font-semibold uppercase tracking-wide text-chrome">
          {listing.priceMode === "ambos" ? "Repasse + final" : priceLabel}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="truncate font-display text-[1.05rem] font-bold uppercase leading-tight tracking-tight text-chrome">
            <Link
              href={`/carros/${listing.id}`}
              className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
            >
              {title}
            </Link>
          </h3>
          <p className="mt-0.5 truncate text-sm text-chrome-muted">{listing.version}</p>
        </div>

        <p className="flex items-center gap-2 text-sm text-chrome-muted">
          <span>{formatYears(listing.manufactureYear, listing.modelYear)}</span>
          <span aria-hidden className="size-1 rounded-full bg-border" />
          <span>{formatKm(listing.km)}</span>
        </p>

        <div className="mt-auto">
          <p className="text-[0.7rem] font-semibold uppercase tracking-wide text-chrome-muted">
            {priceLabel}
          </p>
          <p className="font-display text-2xl font-bold leading-tight text-brand">{formatBRL(price)}</p>
          <p className="mt-0.5 text-xs text-chrome-muted">
            FIPE <span className={cn(comparison.kind === "below" && "line-through")}>{formatBRL(listing.fipePrice)}</span>
            {comparison.kind === "above" && <span> · {comparison.percent}% acima</span>}
          </p>
          {listing.priceMode === "ambos" && listing.finalPrice !== undefined && (
            <p className="mt-1 text-xs text-chrome">
              Preço final <span className="font-semibold">{formatBRL(listing.finalPrice)}</span>
            </p>
          )}
        </div>

        {(listing.condition.hasAuctionHistory || listing.condition.hasAccidentHistory) && (
          <div className="flex flex-wrap gap-1.5">
            {listing.condition.hasAuctionHistory && (
              <Badge variant="warning" icon={<Gavel aria-hidden className="size-3" />}>
                Leilão
              </Badge>
            )}
            {listing.condition.hasAccidentHistory && (
              <Badge variant="danger" icon={<TriangleAlert aria-hidden className="size-3" />}>
                Sinistro
              </Badge>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-border px-4 py-2.5 text-xs text-chrome-muted">
        <span className="flex min-w-0 items-center gap-1">
          <MapPin aria-hidden className="size-3.5 shrink-0" />
          <span className="truncate">
            {listing.city}/{listing.state}
          </span>
        </span>
        <span className="shrink-0 font-medium text-chrome">{SELLER_TYPE_LABEL[listing.seller.sellerType]}</span>
      </div>
    </article>
  );
}
