import { mainPrice } from "@/lib/fipe-math";
import { formatBRL } from "@/lib/format";
import type { ListingWithSeller } from "@/types/listing";
import { WhatsAppButton } from "./WhatsAppButton";

/**
 * Preço + WhatsApp sempre à mão no celular, logo acima da navegação inferior.
 * No tablet (md) a navegação inferior some; a barra desce até o rodapé da tela.
 */
export function MobileContactBar({ listing }: { listing: ListingWithSeller }) {
  return (
    <div className="fixed inset-x-0 bottom-[calc(4rem+env(safe-area-inset-bottom))] z-30 border-t border-border bg-surface/95 px-4 py-3 backdrop-blur-md md:bottom-0 md:pb-[calc(0.75rem+env(safe-area-inset-bottom))] lg:hidden">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-xs text-chrome-muted">
            {listing.brand} {listing.model} {listing.modelYear}
          </p>
          <p className="whitespace-nowrap font-display text-xl font-bold leading-tight text-lime-ink">{formatBRL(mainPrice(listing))}</p>
        </div>
        <WhatsAppButton listing={listing} compact className="h-11 shrink-0 px-4 text-sm" />
      </div>
    </div>
  );
}
