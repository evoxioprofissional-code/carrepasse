import { cn } from "@/lib/cn";
import { formatBRL } from "@/lib/format";

interface FipeComparisonBarProps {
  price: number;
  fipePrice: number;
}

/** Duas barras proporcionais: preço anunciado x tabela FIPE. */
export function FipeComparisonBar({ price, fipePrice }: FipeComparisonBarProps) {
  const max = Math.max(price, fipePrice);
  const rows = [
    { label: "Anúncio", value: price, className: price <= fipePrice ? "bg-lime" : "bg-chrome-muted" },
    { label: "FIPE", value: fipePrice, className: "bg-[#B8BEC6]" },
  ];

  return (
    <div className="flex flex-col gap-2" role="img" aria-label={`Preço ${formatBRL(price)} contra FIPE ${formatBRL(fipePrice)}`}>
      {rows.map((row) => (
        <div key={row.label} className="grid grid-cols-[64px_1fr] items-center gap-3 text-xs">
          <span className="text-chrome-muted">{row.label}</span>
          <span className="h-2.5 overflow-hidden rounded-full bg-surface-2">
            <span
              className={cn("block h-full rounded-full", row.className)}
              style={{ width: `${Math.max(4, (row.value / max) * 100)}%` }}
            />
          </span>
        </div>
      ))}
    </div>
  );
}
