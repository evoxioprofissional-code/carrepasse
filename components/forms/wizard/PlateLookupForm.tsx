"use client";

import { Search } from "lucide-react";
import { useId, useState } from "react";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { fipeApi } from "@/services/fipeApi";
import { plateLookup } from "@/services/plateLookup";
import { formatPlateInput, isValidPlate } from "@/lib/plate";
import type { ListingFormValues } from "@/lib/listing-form";

interface PlateLookupFormProps {
  initialPlate: string;
  onFound: (patch: Partial<ListingFormValues>) => void;
  onManual: () => void;
}

/** Placa → dados do carro (consulta) → valor FIPE. */
export function PlateLookupForm({ initialPlate, onFound, onManual }: PlateLookupFormProps) {
  const inputId = useId();
  const [plate, setPlate] = useState(formatPlateInput(initialPlate));
  const [status, setStatus] = useState<"idle" | "plate" | "fipe">("idle");
  const [error, setError] = useState<string | null>(null);

  const lookup = async () => {
    setError(null);
    if (!isValidPlate(plate)) {
      setError("Placa inválida. Use o formato ABC1D23 (Mercosul) ou ABC-1234.");
      return;
    }
    try {
      setStatus("plate");
      const vehicle = await plateLookup.lookup(plate);
      setStatus("fipe");
      // FIPE do mês pela tabela pública (grátis); o valor que veio com a placa
      // pode ser de um mês anterior e fica como plano B.
      const current =
        vehicle.fipeCode && vehicle.fipeYearCode
          ? await fipeApi.getQuoteByCode(vehicle.fipeCode, vehicle.fipeYearCode).catch(() => null)
          : null;
      const quote = current && !current.fromFallback ? current : (vehicle.fipe ?? current);
      onFound({
        plate: vehicle.plate,
        plateCheckedFor: vehicle.plate,
        brand: vehicle.brand,
        model: vehicle.model,
        version: vehicle.version,
        modelYear: String(vehicle.modelYear),
        manufactureYear: String(vehicle.manufactureYear),
        fuel: vehicle.fuel ?? "",
        transmission: vehicle.transmission ?? "",
        bodyType: vehicle.bodyType ?? "",
        color: vehicle.color,
        fipeCode: vehicle.fipeCode ?? "",
        fipePrice: quote?.price ?? null,
        fipeReferenceMonth: quote?.referenceMonth ?? "",
      });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Não foi possível consultar a placa agora.");
    } finally {
      setStatus("idle");
    }
  };

  const busy = status !== "idle";

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        void lookup();
      }}
      className="flex flex-col gap-5"
    >
      <div className="rounded-2xl border border-border bg-surface p-5 sm:p-8">
        <label htmlFor={inputId} className="block text-center text-sm font-medium text-chrome">
          Placa do carro
        </label>
        <input
          id={inputId}
          value={plate}
          onChange={(event) => setPlate(formatPlateInput(event.target.value))}
          disabled={busy}
          inputMode="text"
          autoCapitalize="characters"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          maxLength={8}
          placeholder="ABC-1D23"
          aria-invalid={error ? true : undefined}
          className="mx-auto mt-3 block h-16 w-full max-w-xs rounded-xl border-2 border-border bg-white text-center font-display text-3xl font-extrabold uppercase tracking-[0.18em] text-ink placeholder:text-ink/25 focus-visible:border-lime-ink focus-visible:ring-lime-ink disabled:opacity-60"
        />
        <p className="mt-2 text-center text-xs text-chrome-muted">Antiga (ABC-1234) ou Mercosul (ABC1D23).</p>

        <Button type="submit" size="lg" fullWidth className="mt-5" disabled={busy}>
          {busy ? <Spinner label="Consultando" /> : <Search aria-hidden className="size-5" />}
          {status === "plate" ? "Consultando a placa..." : status === "fipe" ? "Buscando a FIPE..." : "Buscar dados do carro"}
        </Button>

        {error && (
          <Alert variant="danger" className="mt-4">
            {error}
          </Alert>
        )}
      </div>

      <button
        type="button"
        onClick={onManual}
        disabled={busy}
        className="mx-auto min-h-11 rounded-lg px-3 text-sm font-semibold text-lime-ink underline-offset-4 hover:underline disabled:opacity-50"
      >
        Escolher o carro pela tabela FIPE
      </button>
    </form>
  );
}
