import { formatKm, formatYears } from "@/lib/format";
import { BODY_TYPE_LABEL, FUEL_LABEL, TRANSMISSION_LABEL } from "@/lib/labels";
import type { Listing } from "@/types/listing";

interface SpecsGridProps {
  listing: Listing;
}

export function SpecsGrid({ listing }: SpecsGridProps) {
  const specs: [string, string][] = [
    ["Marca", listing.brand],
    ["Modelo", listing.model],
    ["Versão", listing.version],
    ["Ano", formatYears(listing.manufactureYear, listing.modelYear)],
    ["Quilometragem", formatKm(listing.km)],
    ["Câmbio", TRANSMISSION_LABEL[listing.transmission]],
    ["Combustível", FUEL_LABEL[listing.fuel]],
    ["Cor", listing.color],
    ["Carroceria", BODY_TYPE_LABEL[listing.bodyType]],
    ["Placa", listing.platePrefix ? `${listing.platePrefix}****` : "Não informada"],
    ["Cidade", `${listing.city}/${listing.state}`],
  ];

  return (
    <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-3">
      {specs.map(([label, value]) => (
        <div key={label} className="bg-surface px-4 py-3">
          <dt className="text-xs text-chrome-muted">{label}</dt>
          <dd className="mt-0.5 text-sm font-semibold text-chrome">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
