"use client";

import { useState } from "react";
import type { ListingFormErrors, ListingFormValues } from "@/lib/listing-form";
import { ManualFipePicker } from "./ManualFipePicker";
import { PlateLookupForm } from "./PlateLookupForm";
import { VehicleConfirmCard } from "./VehicleConfirmCard";
import { VehicleEditFields } from "./VehicleEditFields";

type Mode = "plate" | "manual" | "confirm" | "edit";

interface StepVehicleProps {
  values: ListingFormValues;
  errors: ListingFormErrors;
  onChange: (patch: Partial<ListingFormValues>) => void;
  /** Valida a etapa e avança; devolve false se faltou algo. */
  onNext: () => boolean;
}

/** Etapa 1: placa → "É este o seu carro?" (ou tabela FIPE sem placa). */
export function StepVehicle({ values, errors, onChange, onNext }: StepVehicleProps) {
  const [mode, setMode] = useState<Mode>(values.fipePrice || values.brand ? "confirm" : "plate");

  const header = (
    <div className="mb-5">
      <h1 className="text-2xl text-chrome sm:text-3xl">Qual é o carro?</h1>
      <p className="mt-1 text-sm text-chrome-muted sm:text-base">
        Digite a placa e a gente preenche marca, modelo, versão, ano e FIPE para você.
      </p>
    </div>
  );

  return (
    <div>
      {header}
      {mode === "plate" && (
        <PlateLookupForm
          initialPlate={values.plate}
          onManual={() => setMode("manual")}
          onFound={(patch) => {
            onChange(patch);
            // Sem FIPE (tabela fora do ar), o vendedor completa pela tabela.
            setMode(patch.fipePrice ? "confirm" : "edit");
          }}
        />
      )}
      {mode === "manual" && (
        <ManualFipePicker
          onBackToPlate={() => setMode("plate")}
          onPicked={(patch) => {
            onChange({ ...patch, bodyType: "", color: "" });
            setMode("edit");
          }}
        />
      )}
      {mode === "confirm" && (
        <VehicleConfirmCard
          values={values}
          onConfirm={() => {
            // Se faltou algum dado (ex.: carroceria), abre a correção com os erros.
            if (!onNext()) setMode("edit");
          }}
          onFix={() => setMode("edit")}
        />
      )}
      {mode === "edit" && (
        <VehicleEditFields
          values={values}
          errors={errors}
          onChange={onChange}
          onNext={() => void onNext()}
          onPickFromFipe={() => setMode("manual")}
        />
      )}
    </div>
  );
}
