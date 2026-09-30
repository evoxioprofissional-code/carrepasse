import { ArrowRight, CalendarDays, MapPin } from "lucide-react";
import Link from "next/link";
import { SellerAvatar } from "@/components/seller/SellerAvatar";
import { SellerTypeBadge } from "@/components/seller/SellerTypeBadge";
import { formatMonthYear } from "@/lib/format";
import type { ListingWithSeller } from "@/types/listing";
import { DisclaimerNote } from "./DisclaimerNote";
import { WhatsAppButton } from "./WhatsAppButton";

interface SellerCardProps {
  listing: ListingWithSeller;
  /** Anúncio vendido ou pausado não mostra contato. */
  canContact: boolean;
}

export function SellerCard({ listing, canContact }: SellerCardProps) {
  const { seller } = listing;
  const displayName = seller.storeName ?? seller.name;

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-5">
      <div className="flex items-center gap-3">
        <SellerAvatar name={displayName} />
        <div className="min-w-0">
          <p className="truncate font-display text-lg font-bold text-chrome">{displayName}</p>
          {seller.storeName && <p className="truncate text-xs text-chrome-muted">{seller.name}</p>}
          <div className="mt-1">
            <SellerTypeBadge type={seller.sellerType} />
          </div>
        </div>
      </div>

      <ul className="flex flex-col gap-1.5 text-sm text-chrome-muted">
        <li className="flex items-center gap-2">
          <MapPin aria-hidden className="size-4" />
          {seller.city}/{seller.state}
        </li>
        <li className="flex items-center gap-2">
          <CalendarDays aria-hidden className="size-4" />
          No Car Repasse desde {formatMonthYear(seller.createdAt)}
        </li>
      </ul>

      {canContact && <WhatsAppButton listing={listing} className="w-full" />}

      <Link
        href={`/vendedor/${seller.id}`}
        className="inline-flex items-center justify-center gap-1 rounded-lg border border-border py-2.5 text-sm font-semibold text-chrome transition duration-150 hover:border-lime-ink hover:text-lime-ink"
      >
        Ver perfil e outros anúncios
        <ArrowRight aria-hidden className="size-4" />
      </Link>

      {canContact && <DisclaimerNote />}
    </div>
  );
}
