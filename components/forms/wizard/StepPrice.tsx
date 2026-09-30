"use client";

import { Handshake, Tag, Tags } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { RadioGroup } from "@/components/ui/RadioGroup";
import { formatBRL, formatThousandsInput } from "@/lib/format";
import type { ListingFormErrors, ListingFormValues } from "@/lib/listing-form";
import type { PriceMode } from "@/types/listing";
import { PriceFeedback } from "./PriceFeedback";

interface StepPriceProps {
  values: ListingFormValues;
  errors: ListingFormErrors;
  onChange: (patch: Partial<ListingFormValues>) => void;
}

const MODES = [
  {
    value: "repasse" as const,
    label: "Repasse",
    description: "Abaixo da FIPE, no estado em que está. Para lojistas, corretores e quem quer pagar menos.",
    icon: <Handshake />,
  },
  {
    value: "final" as const,
    label: "Preço final",
    description: "Para o comprador final. Pode incluir revisão, garantia ou reparos feitos por você.",
    icon: <Tag />,
  },
  {
    value: "ambos" as const,
    label: "Os dois",
    description: "Mostra o repasse para quem é do ramo e o preço final para o consumidor.",
    icon: <Tags />,
  },
];

export function StepPrice({ values, errors, onChange }: StepPriceProps) {
  const showRepasse = values.priceMode === "repasse" || values.priceMode === "ambos";
  const showFinal = values.priceMode === "final" || values.priceMode === "ambos";

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl text-chrome sm:text-3xl">Quanto você quer?</h1>
        <p className="mt-1 text-sm text-chrome-muted sm:text-base">
          FIPE deste carro: <strong className="text-chrome">{values.fipePrice ? formatBRL(values.fipePrice) : "—"}</strong>
          {values.fipeReferenceMonth ? ` (${values.fipeReferenceMonth})` : ""}
        </p>
      </div>

      <RadioGroup
        legend="Modalidade"
        variant="cards"
        options={MODES}
        value={values.priceMode || undefined}
        onChange={(priceMode: PriceMode) => onChange({ priceMode })}
        error={errors.priceMode}
      />

      {showRepasse && (
        <div className="flex flex-col gap-3">
          <Input
            label="Preço de repasse"
            required
            prefix="R$"
            inputMode="numeric"
            placeholder="45.900"
            value={values.repassePrice}
            error={errors.repassePrice}
            onChange={(event) => onChange({ repassePrice: formatThousandsInput(event.target.value) })}
          />
          <PriceFeedback label="preço de repasse" value={values.repassePrice} fipePrice={values.fipePrice} />
        </div>
      )}

      {showFinal && (
        <div className="flex flex-col gap-3">
          <Input
            label="Preço final"
            required
            prefix="R$"
            inputMode="numeric"
            placeholder="52.900"
            value={values.finalPrice}
            error={errors.finalPrice}
            hint={values.priceMode === "ambos" ? "Precisa ser maior que o preço de repasse." : undefined}
            onChange={(event) => onChange({ finalPrice: formatThousandsInput(event.target.value) })}
          />
          <PriceFeedback label="preço final" value={values.finalPrice} fipePrice={values.fipePrice} />
        </div>
      )}
    </div>
  );
}
