import { ArrowRight, MapPin, TrendingDown, TriangleAlert, UserRound } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { compareWithFipe, mainPrice } from "@/lib/fipe-math";
import { formatBRL, formatKm } from "@/lib/format";
import { PRICE_MODE_LABEL, SELLER_TYPE_LABEL } from "@/lib/labels";
import { isExpired } from "@/lib/listing-expiry";
import { recentPriceDrop } from "@/lib/price-drop";
import type { ListingWithSeller } from "@/types/listing";
import { FavoriteButton } from "./FavoriteButton";
import { ListingPhoto } from "./ListingPhoto";

interface VehicleCardProps {
  listing: ListingWithSeller;
  priority?: boolean;
  className?: string;
}

/** Card claro da vitrine: foto grande, preço em destaque e comparação com a FIPE. */
export function VehicleCard({ listing, priority, className }: VehicleCardProps) {
  const title = [listing.brand, listing.model].filter(Boolean).join(" ") || "Veículo";
  const price = mainPrice(listing);
  const comparison = compareWithFipe(listing.fipePrice, price);
  const details = [listing.version, listing.modelYear ? String(listing.modelYear) : "", listing.km >= 0 ? formatKm(listing.km) : ""]
    .filter(Boolean)
    .join(" • ");
  const location = [listing.city, listing.state].filter(Boolean).join("/");
  // Favoritos podem trazer anúncios que saíram da busca: aparecem esmaecidos.
  const unavailable =
    listing.status === "vendido" ? "Vendido" : listing.status === "pausado" ? "Pausado" : isExpired(listing) ? "Indisponível" : null;
  const priceDrop = recentPriceDrop(listing);
  const alerts = [
    listing.condition.hasAuctionHistory && "Leilão",
    listing.condition.hasAccidentHistory && "Sinistro",
  ].filter((alert): alert is string => Boolean(alert));

  return (
    <article
      className={cn(
        "group relative flex min-w-0 flex-col overflow-hidden rounded-[10px] border border-line bg-white transition duration-150",
        "hover:border-[#cdd2d8] hover:shadow-[0_8px_24px_rgba(15,17,19,0.08)] has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-lime-ink",
        className,
      )}
    >
      <div className="relative aspect-[5/3] overflow-hidden bg-paper">
        <ListingPhoto
          src={listing.photos[0]}
          alt={`${title} ${listing.version}`.trim()}
          sizes="(min-width: 1280px) 340px, (min-width: 1024px) 31vw, (min-width: 640px) 47vw, 100vw"
          priority={priority}
          tone="light"
          className={cn("transition duration-300 group-hover:scale-[1.02]", unavailable && "opacity-50 grayscale")}
        />
        <span className="pointer-events-none absolute left-2 top-2 rounded-md bg-night/80 px-2 py-1 text-xs font-semibold leading-none text-white backdrop-blur-sm">
          {PRICE_MODE_LABEL[listing.priceMode]}
        </span>
        {unavailable && (
          <span className="pointer-events-none absolute inset-x-0 top-1/2 mx-auto w-max -translate-y-1/2 rounded-md bg-night px-3 py-1.5 text-sm font-bold uppercase tracking-wide text-white">
            {unavailable}
          </span>
        )}
        <FavoriteButton
          listingId={listing.id}
          listingTitle={title}
          variant="plain"
          className="absolute right-2 top-2 z-10"
        />
      </div>

      <div className="flex flex-1 flex-col px-4 pb-4 pt-3.5">
        <h3 className="truncate text-[17px] font-bold leading-snug text-ink" title={title}>
          {title}
        </h3>
        {details && (
          <p className="mt-0.5 truncate text-[13px] text-ink-muted" title={details}>
            {details}
          </p>
        )}
        {alerts.length > 0 && (
          <p className="mt-2 flex flex-wrap gap-1.5">
            {alerts.map((alert) => (
              <span
                key={alert}
                className="inline-flex items-center gap-1 rounded-md border border-warning/40 bg-warning/10 px-1.5 py-0.5 text-xs font-semibold text-warning-ink"
              >
                <TriangleAlert aria-hidden className="size-3" />
                {alert}
              </span>
            ))}
          </p>
        )}

        {priceDrop && !unavailable && (
          <p className="mt-2.5 inline-flex items-center gap-1 text-[13px] font-semibold text-lime-ink">
            <TrendingDown aria-hidden className="size-4" />
            Baixou {formatBRL(priceDrop)}
          </p>
        )}
        <div className={cn("flex flex-wrap items-center gap-x-3 gap-y-1.5", priceDrop && !unavailable ? "mt-1" : "mt-3")}>
          {price > 0 ? (
            <p className="text-[26px] font-extrabold leading-none tracking-tight text-ink">{formatBRL(price)}</p>
          ) : (
            <p className="text-lg font-bold text-ink">Preço não informado</p>
          )}
          {comparison.kind === "below" && (
            <span className="rounded-md bg-lime-soft px-2 py-1 text-[13px] font-medium leading-none text-lime-ink">
              {comparison.percent}% abaixo da FIPE
            </span>
          )}
          {comparison.kind === "equal" && (
            <span className="rounded-md bg-paper px-2 py-1 text-[13px] font-medium leading-none text-ink-muted">
              No valor da FIPE
            </span>
          )}
          {comparison.kind === "above" && (
            <span className="rounded-md bg-paper px-2 py-1 text-[13px] font-medium leading-none text-ink-muted">
              {comparison.percent}% acima da FIPE
            </span>
          )}
        </div>

        {comparison.kind !== "unknown" && (
          <p className="mt-2 text-[13px] text-ink-muted">
            FIPE <span className={cn(comparison.kind === "below" && "line-through")}>{formatBRL(listing.fipePrice)}</span>
          </p>
        )}

        <div className="mt-3 flex min-w-0 flex-wrap items-center gap-x-5 gap-y-1 text-sm text-ink-muted">
          {location && (
            <span className="flex min-w-0 items-center gap-1.5">
              <MapPin aria-hidden className="size-4 shrink-0" />
              <span className="truncate">{location}</span>
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <UserRound aria-hidden className="size-4 shrink-0" />
            {SELLER_TYPE_LABEL[listing.seller.sellerType]}
          </span>
        </div>

        <Link
          href={`/carros/${listing.id}`}
          aria-label={`Ver anúncio: ${title} ${listing.modelYear || ""}`.trim()}
          className={cn(
            "mt-4 flex h-11 items-center sm:h-9 justify-center gap-2 rounded-md border border-lime text-sm font-semibold text-lime-ink transition duration-150",
            "hover:bg-lime-soft focus-visible:outline-none",
            // Link esticado: o card inteiro abre o anúncio; o coração fica por cima (z-10).
            "after:absolute after:inset-0 after:content-['']",
          )}
        >
          Ver anúncio
          <ArrowRight aria-hidden className="size-4" />
        </Link>
      </div>
    </article>
  );
}
