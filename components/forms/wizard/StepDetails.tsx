"use client";

import { Lightbulb } from "lucide-react";
import { CityField } from "@/components/forms/CityField";
import { Checkbox } from "@/components/ui/Checkbox";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { STATE_OPTIONS } from "@/lib/brazil";
import { formatThousandsInput } from "@/lib/format";
import { MIN_DESCRIPTION, type ListingFormErrors, type ListingFormValues } from "@/lib/listing-form";
import type { VehicleCondition } from "@/types/listing";

interface StepDetailsProps {
  values: ListingFormValues;
  errors: ListingFormErrors;
  onChange: (patch: Partial<ListingFormValues>) => void;
}

const CONDITION_ITEMS: { key: keyof VehicleCondition; label: string; description: string }[] = [
  { key: "hasAuctionHistory", label: "Já passou por leilão", description: "Consta no documento ou no histórico do carro." },
  { key: "hasAccidentHistory", label: "Tem histórico de sinistro", description: "Batida grande, enchente ou indenização de seguradora." },
  { key: "isFinanced", label: "Está financiado (alienado)", description: "A quitação acontece na hora da venda." },
  { key: "hasDebts", label: "Tem débitos", description: "IPVA, licenciamento ou multas em aberto." },
  { key: "singleOwner", label: "Único dono", description: "Nunca foi transferido." },
  { key: "hasServiceRecords", label: "Revisões comprovadas", description: "Manual carimbado ou notas das revisões." },
  { key: "hasSpareKey", label: "Tem chave reserva", description: "" },
];

const TIPS = ["Lataria e pintura", "Motor e câmbio", "Pneus", "Documentação", "O que precisa de reparo"];

export function StepDetails({ values, errors, onChange }: StepDetailsProps) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl text-chrome sm:text-3xl">Como o carro está?</h1>
        <p className="mt-1 text-sm text-chrome-muted sm:text-base">Quem é claro sobre o estado do carro vende mais rápido.</p>
      </div>

      <section className="grid gap-4 rounded-2xl border border-border bg-surface p-5 sm:grid-cols-2 sm:p-6">
        <Input
          label="Quilometragem"
          required
          inputMode="numeric"
          suffix="km"
          placeholder="87.500"
          value={values.km}
          error={errors.km}
          onChange={(event) => onChange({ km: formatThousandsInput(event.target.value) })}
          containerClassName="sm:col-span-2"
        />
        <Select
          label="Estado"
          required
          placeholder="Escolha"
          options={STATE_OPTIONS}
          value={values.state}
          error={errors.state}
          onChange={(event) => onChange({ state: event.target.value, city: "" })}
        />
        <CityField
          uf={values.state}
          required
          value={values.city}
          error={errors.city}
          onChange={(event) => onChange({ city: event.target.value })}
        />
      </section>

      <section className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
        <h2 className="text-lg text-chrome">Transparência</h2>
        <p className="mt-1 text-sm text-chrome-muted">Marque o que vale para o carro. Isso aparece no anúncio.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {CONDITION_ITEMS.map((item) => (
            <Checkbox
              key={item.key}
              label={item.label}
              description={item.description || undefined}
              checked={values.condition[item.key]}
              onChange={(event) => onChange({ condition: { ...values.condition, [item.key]: event.target.checked } })}
            />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-5 sm:p-6">
        <div className="flex gap-2 rounded-lg bg-surface-2 p-3 text-sm text-chrome-muted">
          <Lightbulb aria-hidden className="mt-0.5 size-4 shrink-0 text-lime-ink" />
          <p>
            Fale de: <span className="text-chrome">{TIPS.join(" · ")}</span>.
          </p>
        </div>
        <Textarea
          label="Descrição do vendedor"
          required
          minChars={MIN_DESCRIPTION}
          rows={7}
          value={values.description}
          error={errors.description}
          placeholder="Ex.: Carro de uso diário, revisões na concessionária, pneus com 60%. Tem um risco no para-choque traseiro. Documento em dia."
          onChange={(event) => onChange({ description: event.target.value })}
        />
      </section>
    </div>
  );
}
