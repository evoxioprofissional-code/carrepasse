import { ArrowRight, MapPin, UserRound } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { compareWithFipe, mainPrice } from "@/lib/fipe-math";
import { formatBRL, formatKm } from "@/lib/format";
import { SELLER_TYPE_LABEL } from "@/lib/labels";
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
          className="transition duration-300 group-hover:scale-[1.02]"
        />
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

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5">
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
            "mt-4 flex h-9 items-center justify-center gap-2 rounded-md border border-lime text-sm font-semibold text-lime-ink transition duration-150",
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
