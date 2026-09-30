"use client";

import Link from "next/link";
import { VehicleCard } from "@/components/listing/VehicleCard";
import { Alert } from "@/components/ui/Alert";
import { Checkbox } from "@/components/ui/Checkbox";
import { formatBRL, formatYears } from "@/lib/format";
import { PRICE_MODE_LABEL } from "@/lib/labels";
import { toListingFields, type ListingFormErrors, type ListingFormValues } from "@/lib/listing-form";
import { DISCLAIMER } from "@/lib/site";
import type { ListingWithSeller } from "@/types/listing";
import type { User } from "@/types/user";
import { SummaryRow } from "./SummaryRow";

interface StepReviewProps {
  values: ListingFormValues;
  errors: ListingFormErrors;
  onChange: (patch: Partial<ListingFormValues>) => void;
  onGoTo: (step: number) => void;
  user: User;
  /** Na edição o carro não muda (sem "Editar" na etapa 1). */
  canEditVehicle: boolean;
}

export function StepReview({ values, errors, onChange, onGoTo, user, canEditVehicle }: StepReviewProps) {
  const fields = toListingFields(values);
  const now = new Date().toISOString();
  const preview: ListingWithSeller = {
    ...fields,
    id: "previa",
    sellerId: user.id,
    platePrefix: values.plate ? values.plate.slice(0, 3) : undefined,
    status: "ativo",
    views: 0,
    createdAt: now,
    updatedAt: now,
    confirmedAt: now,
    seller: {
      id: user.id,
      name: user.name,
      storeName: user.storeName,
      sellerType: user.sellerType,
      city: user.city,
      state: user.state,
      phone: user.phone,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
    },
  };
  const warnings = Object.values(values.condition).filter(Boolean).length;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl text-chrome sm:text-3xl">{canEditVehicle ? "Confira antes de publicar" : "Confira antes de salvar"}</h1>
        <p className="mt-1 text-sm text-chrome-muted sm:text-base">É assim que o seu carro vai aparecer para os compradores.</p>
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        {/* Prévia fiel ao card da vitrine (sem cliques) */}
        <div inert className="min-w-0 rounded-2xl bg-paper p-3 sm:p-4">
          <VehicleCard listing={preview} />
        </div>

        <div className="min-w-0 rounded-2xl border border-border bg-surface px-5 py-2">
          <SummaryRow title="Carro" step={canEditVehicle ? 0 : undefined} onGoTo={onGoTo}>
            {values.brand} {values.model} {values.version} · {formatYears(Number(values.manufactureYear), Number(values.modelYear))} · {values.color}
          </SummaryRow>
          <SummaryRow title="Quilometragem e local" step={1} onGoTo={onGoTo}>
            {values.km} km · {values.city}/{values.state}
          </SummaryRow>
          <SummaryRow title="Estado do carro" step={1} onGoTo={onGoTo}>
            {warnings === 0 ? "Nada marcado no checklist" : `${warnings} ${warnings === 1 ? "item marcado" : "itens marcados"} no checklist`}
            <p className="mt-1 line-clamp-2 text-chrome-muted">{values.description}</p>
          </SummaryRow>
          <SummaryRow title="Fotos" step={2} onGoTo={onGoTo}>
            {values.photos.length} {values.photos.length === 1 ? "foto" : "fotos"}
          </SummaryRow>
          <SummaryRow title="Preço" step={3} onGoTo={onGoTo}>
            {values.priceMode ? PRICE_MODE_LABEL[values.priceMode] : "—"}
            {fields.repassePrice ? ` · repasse ${formatBRL(fields.repassePrice)}` : ""}
            {fields.finalPrice ? ` · final ${formatBRL(fields.finalPrice)}` : ""}
          </SummaryRow>
        </div>
      </div>

      <Alert variant="warning" title="Antes de publicar">
        {DISCLAIMER}
      </Alert>

      <Checkbox
        label={
          <>
            Confirmo que as informações são verdadeiras e aceito os{" "}
            <Link href="/termos" target="_blank" className="text-lime-ink underline-offset-2 hover:underline">
              termos de uso
            </Link>{" "}
            e o aviso acima.
          </>
        }
        checked={values.acceptTerms}
        error={errors.acceptTerms}
        onChange={(event) => onChange({ acceptTerms: event.target.checked })}
      />
    </div>
  );
}
