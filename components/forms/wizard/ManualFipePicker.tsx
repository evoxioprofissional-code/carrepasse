"use client";

import { useEffect, useState } from "react";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Spinner } from "@/components/ui/Spinner";
import { guessTransmission, mapFipeFuel, normalizeBrand, splitFipeModel } from "@/lib/fipe-names";
import type { ListingFormValues } from "@/lib/listing-form";
import { fipeApi } from "@/services/fipeApi";
import type { FipeOption } from "@/types/fipe";

interface ManualFipePickerProps {
  onPicked: (patch: Partial<ListingFormValues>) => void;
  onBackToPlate: () => void;
}

type Loaded<T> = { key: string; items: T } | null;

/** Sem placa: marca → modelo → ano direto da tabela FIPE. */
export function ManualFipePicker({ onPicked, onBackToPlate }: ManualFipePickerProps) {
  const [brands, setBrands] = useState<FipeOption[] | null>(null);
  const [brand, setBrand] = useState("");
  const [models, setModels] = useState<Loaded<FipeOption[]>>(null);
  const [model, setModel] = useState("");
  const [years, setYears] = useState<Loaded<FipeOption[]>>(null);
  const [year, setYear] = useState("");
  const [loadingQuote, setLoadingQuote] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fipeApi
      .getBrands()
      .then((items) => !cancelled && setBrands(items))
      .catch(() => !cancelled && setError("Não foi possível carregar as marcas da FIPE."));
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!brand) return;
    let cancelled = false;
    fipeApi
      .getModels(brand)
      .then((items) => !cancelled && setModels({ key: brand, items }))
      .catch(() => !cancelled && setError("Não foi possível carregar os modelos."));
    return () => {
      cancelled = true;
    };
  }, [brand]);

  useEffect(() => {
    if (!brand || !model) return;
    let cancelled = false;
    fipeApi
      .getYears(brand, model)
      .then((items) => !cancelled && setYears({ key: `${brand}/${model}`, items }))
      .catch(() => !cancelled && setError("Não foi possível carregar os anos."));
    return () => {
      cancelled = true;
    };
  }, [brand, model]);

  const modelOptions = models?.key === brand ? models.items : [];
  const yearOptions = years?.key === `${brand}/${model}` ? years.items : [];

  const confirm = async () => {
    if (!brand || !model || !year) return;
    setError(null);
    setLoadingQuote(true);
    try {
      const quote = await fipeApi.getQuote(brand, model, year);
      const { model: modelName, version } = splitFipeModel(quote.model);
      onPicked({
        brand: normalizeBrand(quote.brand),
        model: modelName,
        version,
        modelYear: String(quote.modelYear),
        manufactureYear: String(quote.modelYear),
        fuel: mapFipeFuel(quote.fuel) ?? "",
        transmission: guessTransmission(quote.model) ?? "",
        fipeCode: quote.fipeCode,
        fipePrice: quote.price,
        fipeReferenceMonth: quote.referenceMonth,
      });
    } catch {
      setError("Não foi possível buscar o valor FIPE. Tente de novo.");
    } finally {
      setLoadingQuote(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-5 sm:p-8">
        <div>
          <h2 className="text-xl text-chrome">Escolha pela tabela FIPE</h2>
          <p className="mt-1 text-sm text-chrome-muted">Os dados e o valor FIPE vêm direto da tabela oficial.</p>
        </div>
        {error && <Alert variant="danger">{error}</Alert>}
        {!brands && !error ? (
          <p className="flex items-center gap-2 text-sm text-chrome-muted">
            <Spinner /> Carregando marcas…
          </p>
        ) : (
          <>
            <Select
              label="Marca"
              placeholder="Escolha a marca"
              options={(brands ?? []).map((item) => ({ value: item.code, label: item.name }))}
              value={brand}
              onChange={(event) => {
                setBrand(event.target.value);
                setModel("");
                setYear("");
              }}
            />
            <Select
              label="Modelo"
              placeholder={brand ? (modelOptions.length ? "Escolha o modelo" : "Carregando…") : "Escolha a marca primeiro"}
              options={modelOptions.map((item) => ({ value: item.code, label: item.name }))}
              value={model}
              disabled={!brand || modelOptions.length === 0}
              onChange={(event) => {
                setModel(event.target.value);
                setYear("");
              }}
            />
            <Select
              label="Ano do modelo"
              placeholder={model ? (yearOptions.length ? "Escolha o ano" : "Carregando…") : "Escolha o modelo primeiro"}
              options={yearOptions.map((item) => ({ value: item.code, label: item.name }))}
              value={year}
              disabled={!model || yearOptions.length === 0}
              onChange={(event) => setYear(event.target.value)}
            />
          </>
        )}
        <Button size="lg" fullWidth disabled={!year} loading={loadingQuote} onClick={() => void confirm()}>
          Usar este carro
        </Button>
      </div>
      <button
        type="button"
        onClick={onBackToPlate}
        className="mx-auto min-h-11 rounded-lg px-3 text-sm font-semibold text-brand underline-offset-4 hover:underline"
      >
        Voltar e buscar pela placa
      </button>
    </div>
  );
}
