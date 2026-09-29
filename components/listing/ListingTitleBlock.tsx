import { CalendarDays, Eye, Gauge, MapPin, TriangleAlert } from "lucide-react";
import { SellerTypeBadge } from "@/components/seller/SellerTypeBadge";
import { Badge } from "@/components/ui/Badge";
import { formatKm, formatNumber, formatRelativeDate, formatYears } from "@/lib/format";
import { PRICE_MODE_LABEL } from "@/lib/labels";
import type { ListingWithSeller } from "@/types/listing";

export function ListingTitleBlock({ listing }: { listing: ListingWithSeller }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-1.5">
        <Badge variant="brand">{PRICE_MODE_LABEL[listing.priceMode]}</Badge>
        <SellerTypeBadge type={listing.seller.sellerType} />
        {listing.condition.hasAuctionHistory && (
          <Badge variant="warning" icon={<TriangleAlert aria-hidden className="size-3" />}>
            Leilão
          </Badge>
        )}
        {listing.condition.hasAccidentHistory && (
          <Badge variant="danger" icon={<TriangleAlert aria-hidden className="size-3" />}>
            Sinistro
          </Badge>
        )}
      </div>
      <div>
        <h1 className="font-display text-3xl font-extrabold uppercase leading-tight text-chrome">
          {listing.brand} {listing.model}
        </h1>
        <p className="mt-1 text-chrome-muted">{listing.version}</p>
      </div>
      <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm text-chrome-muted">
        <li className="flex items-center gap-1.5">
          <CalendarDays aria-hidden className="size-4" />
          {formatYears(listing.manufactureYear, listing.modelYear)}
        </li>
        <li className="flex items-center gap-1.5">
          <Gauge aria-hidden className="size-4" />
          {formatKm(listing.km)}
        </li>
        <li className="flex items-center gap-1.5">
          <MapPin aria-hidden className="size-4" />
          {listing.city}/{listing.state}
        </li>
        <li className="flex items-center gap-1.5">
          <Eye aria-hidden className="size-4" />
          {formatNumber(listing.views)} visualizações
        </li>
      </ul>
      <p className="text-xs text-chrome-muted">Publicado {formatRelativeDate(listing.createdAt)}</p>
    </div>
  );
}
