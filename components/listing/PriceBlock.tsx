import { TrendingDown, TrendingUp } from "lucide-react";
import { Tooltip } from "@/components/ui/Tooltip";
import { cn } from "@/lib/cn";
import { compareWithFipe, mainPrice } from "@/lib/fipe-math";
import { formatBRL } from "@/lib/format";
import type { Listing } from "@/types/listing";
import { FipeComparisonBar } from "./FipeComparisonBar";

interface PriceBlockProps {
  listing: Listing;
}

const REPASSE_HELP =
  "Valor abaixo da FIPE para quem compra no estado em que o carro está, geralmente lojista ou corretor. Sem revisão ou garantia da loja.";
const FINAL_HELP =
  "Valor para o consumidor final. Pode incluir revisão, garantia ou reparos feitos pelo vendedor — confirme com ele o que está incluso.";

export function PriceBlock({ listing }: PriceBlockProps) {
  const price = mainPrice(listing);
  const comparison = compareWithFipe(listing.fipePrice, price);
  const hasBoth = listing.repassePrice !== undefined && listing.finalPrice !== undefined;

  return (
    <div className="flex flex-col gap-4">
      {listing.repassePrice !== undefined && (
        <div>
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-chrome-muted">
            Preço de repasse
            <Tooltip label="O que é preço de repasse?" align="start">
              {REPASSE_HELP}
            </Tooltip>
          </p>
          <p className="font-display text-4xl font-bold leading-tight text-brand">
            {formatBRL(listing.repassePrice)}
          </p>
        </div>
      )}

      {listing.finalPrice !== undefined && (
        <div className={cn(hasBoth && "rounded-lg border border-border bg-surface-2 px-3 py-2")}>
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-chrome-muted">
            Preço final
            <Tooltip label="O que é preço final?" align="start">
              {FINAL_HELP}
            </Tooltip>
          </p>
          <p
            className={cn(
              "font-display font-bold leading-tight",
              hasBoth ? "text-2xl text-chrome" : "text-4xl text-brand",
            )}
          >
            {formatBRL(listing.finalPrice)}
          </p>
        </div>
      )}

      <div className="flex flex-col gap-3 rounded-lg border border-border p-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs text-chrome-muted">
              Tabela FIPE{listing.fipeReferenceMonth ? ` · ${listing.fipeReferenceMonth}` : ""}
            </p>
            <p className="font-semibold text-chrome">{formatBRL(listing.fipePrice)}</p>
            {listing.fipeCode && <p className="text-xs text-chrome-muted">Código {listing.fipeCode}</p>}
          </div>
          {comparison.kind === "below" && (
            <span className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-md bg-brand-gradient px-2.5 py-1 text-sm font-bold text-bg">
              <TrendingDown aria-hidden className="size-4" />
              {comparison.percent}% abaixo
            </span>
          )}
          {comparison.kind === "above" && (
            <span className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-md border border-border px-2.5 py-1 text-sm text-chrome-muted">
              <TrendingUp aria-hidden className="size-4" />
              {comparison.percent}% acima
            </span>
          )}
          {comparison.kind === "equal" && (
            <span className="rounded-md border border-border px-2.5 py-1 text-sm text-chrome-muted">Na FIPE</span>
          )}
        </div>
        <FipeComparisonBar price={price} fipePrice={listing.fipePrice} />
        {comparison.kind === "below" && (
          <p className="text-xs text-chrome-muted">
            Economia de <strong className="text-chrome">{formatBRL(listing.fipePrice - price)}</strong> em
            relação à tabela.
          </p>
        )}
      </div>
    </div>
  );
}
