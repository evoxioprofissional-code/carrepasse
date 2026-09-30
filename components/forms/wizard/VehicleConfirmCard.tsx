import { CarFront, Check, PencilLine } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formatBRL, formatYears } from "@/lib/format";
import { BODY_TYPE_LABEL, FUEL_LABEL, TRANSMISSION_LABEL } from "@/lib/labels";
import type { ListingFormValues } from "@/lib/listing-form";
import { maskPlate } from "@/lib/plate";

interface VehicleConfirmCardProps {
  values: ListingFormValues;
  onConfirm: () => void;
  onFix: () => void;
}

/** "É este o seu carro?" depois da consulta. */
export function VehicleConfirmCard({ values, onConfirm, onFix }: VehicleConfirmCardProps) {
  const rows: [string, string][] = [
    ["Ano", formatYears(Number(values.manufactureYear), Number(values.modelYear))],
    ["Cor", values.color],
    ["Combustível", values.fuel ? FUEL_LABEL[values.fuel] : "—"],
    ["Câmbio", values.transmission ? TRANSMISSION_LABEL[values.transmission] : "—"],
    ["Carroceria", values.bodyType ? BODY_TYPE_LABEL[values.bodyType] : "—"],
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-2xl border border-brand/40 bg-surface p-5 sm:p-8">
        <p className="text-sm font-semibold text-brand">É este o seu carro?</p>
        <div className="mt-3 flex items-start gap-3">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
            <CarFront aria-hidden className="size-6" />
          </span>
          <div className="min-w-0">
            <h2 className="text-2xl uppercase leading-tight text-chrome">
              {values.brand} {values.model}
            </h2>
            <p className="text-chrome-muted">{values.version}</p>
            {values.plate && <p className="mt-1 text-xs text-chrome-muted">Placa {maskPlate(values.plate)}</p>}
          </div>
        </div>

        <dl className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border">
          {rows.map(([label, value]) => (
            <div key={label} className="bg-surface-2 px-3 py-2.5">
              <dt className="text-xs text-chrome-muted">{label}</dt>
              <dd className="text-sm font-semibold text-chrome">{value}</dd>
            </div>
          ))}
          <div className="bg-surface-2 px-3 py-2.5">
            <dt className="text-xs text-chrome-muted">FIPE{values.fipeReferenceMonth ? ` · ${values.fipeReferenceMonth}` : ""}</dt>
            <dd className="text-sm font-semibold text-brand">
              {values.fipePrice ? formatBRL(values.fipePrice) : "Não encontrada"}
            </dd>
          </div>
        </dl>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row-reverse">
        <Button size="lg" onClick={onConfirm} className="sm:flex-1">
          <Check aria-hidden className="size-5" />
          Sim, é este
        </Button>
        <Button variant="secondary" size="lg" onClick={onFix} className="sm:flex-1">
          <PencilLine aria-hidden className="size-5" />
          Corrigir dados
        </Button>
      </div>
    </div>
  );
}
