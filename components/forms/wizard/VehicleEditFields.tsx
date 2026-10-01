"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { formatBRL } from "@/lib/format";
import { BODY_TYPE_LABEL, FUEL_LABEL, TRANSMISSION_LABEL, optionsFrom } from "@/lib/labels";
import type { ListingFormErrors, ListingFormValues } from "@/lib/listing-form";
import { formatPlateInput, normalizePlate } from "@/lib/plate";
import type { BodyType, Fuel, Transmission } from "@/types/listing";

interface VehicleEditFieldsProps {
  values: ListingFormValues;
  errors: ListingFormErrors;
  onChange: (patch: Partial<ListingFormValues>) => void;
  onNext: () => void;
  onPickFromFipe: () => void;
  /** Placa barrada na consulta (roubo/furto, não é carro). */
  plateError?: string;
  /** Consultando a placa digitada antes de seguir. */
  verifying?: boolean;
}

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 40 }, (_, index) => String(CURRENT_YEAR + 1 - index)).map((year) => ({ value: year, label: year }));
const COLORS = ["Branco", "Prata", "Preto", "Cinza", "Vermelho", "Azul", "Verde", "Marrom", "Bege", "Amarelo", "Laranja", "Dourado", "Vinho"].map(
  (color) => ({ value: color, label: color }),
);

/** Conferir e corrigir os dados do carro (vindos da placa ou da FIPE). */
export function VehicleEditFields({ values, errors, onChange, onNext, onPickFromFipe, plateError, verifying }: VehicleEditFieldsProps) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-5 sm:p-8">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl text-chrome">Dados do carro</h2>
            <p className="mt-1 text-sm text-chrome-muted">Confira e corrija o que for preciso.</p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-xs text-chrome-muted">FIPE</p>
            <p className="font-semibold text-lime-ink">{values.fipePrice ? formatBRL(values.fipePrice) : "—"}</p>
          </div>
        </div>
        {errors.fipePrice && <p role="alert" className="text-sm text-danger-ink">{errors.fipePrice}</p>}

        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Marca" required value={values.brand} error={errors.brand} onChange={(event) => onChange({ brand: event.target.value })} />
          <Input label="Modelo" required value={values.model} error={errors.model} onChange={(event) => onChange({ model: event.target.value })} />
          <Input
            label="Versão"
            required
            containerClassName="sm:col-span-2"
            value={values.version}
            error={errors.version}
            hint="Ex.: 1.0 LT Turbo Automático"
            onChange={(event) => onChange({ version: event.target.value })}
          />
          <Select
            label="Ano de fabricação"
            required
            placeholder="Escolha"
            options={YEARS}
            value={values.manufactureYear}
            error={errors.manufactureYear}
            onChange={(event) => onChange({ manufactureYear: event.target.value })}
          />
          <Select
            label="Ano do modelo"
            required
            placeholder="Escolha"
            options={YEARS}
            value={values.modelYear}
            error={errors.modelYear}
            onChange={(event) => onChange({ modelYear: event.target.value })}
          />
          <Select
            label="Combustível"
            required
            placeholder="Escolha"
            options={optionsFrom(FUEL_LABEL)}
            value={values.fuel}
            error={errors.fuel}
            onChange={(event) => onChange({ fuel: event.target.value as Fuel })}
          />
          <Select
            label="Câmbio"
            required
            placeholder="Escolha"
            options={optionsFrom(TRANSMISSION_LABEL)}
            value={values.transmission}
            error={errors.transmission}
            onChange={(event) => onChange({ transmission: event.target.value as Transmission })}
          />
          <Select
            label="Carroceria"
            required
            placeholder="Escolha"
            options={optionsFrom(BODY_TYPE_LABEL)}
            value={values.bodyType}
            error={errors.bodyType}
            onChange={(event) => onChange({ bodyType: event.target.value as BodyType })}
          />
          <Select
            label="Cor"
            required
            placeholder="Escolha"
            options={values.color && !COLORS.some((c) => c.value === values.color) ? [...COLORS, { value: values.color, label: values.color }] : COLORS}
            value={values.color}
            error={errors.color}
            onChange={(event) => onChange({ color: event.target.value })}
          />
          <Input
            label="Placa"
            required
            containerClassName="sm:col-span-2"
            value={formatPlateInput(values.plate)}
            maxLength={8}
            autoCapitalize="characters"
            autoComplete="off"
            error={plateError ?? errors.plate}
            hint="Nunca aparece completa no anúncio (só ABC****). Usamos para checar roubo/furto."
            onChange={(event) => onChange({ plate: normalizePlate(event.target.value).slice(0, 7) })}
          />
        </div>

        <button
          type="button"
          onClick={onPickFromFipe}
          className="self-start min-h-11 rounded-lg text-sm font-semibold text-lime-ink underline-offset-4 hover:underline"
        >
          Carro errado? Escolher de novo pela tabela FIPE
        </button>
      </div>

      <Button size="lg" fullWidth onClick={onNext} loading={verifying} className="sm:ml-auto sm:w-auto sm:px-8">
        {verifying ? "Conferindo a placa..." : "Continuar"}
      </Button>
    </div>
  );
}
