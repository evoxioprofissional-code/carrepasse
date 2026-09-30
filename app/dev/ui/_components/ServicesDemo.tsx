"use client";

import { useState } from "react";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { compareWithFipe } from "@/lib/fipe-math";
import { formatBRL } from "@/lib/format";
import { formatPlateInput } from "@/lib/plate";
import { fipeApi } from "@/services/fipeApi";
import { plateLookup } from "@/services/plateLookup";
import type { FipeQuote, PlateLookupResult } from "@/types/fipe";

type Status = "idle" | "loading" | "done" | "error";

export function ServicesDemo() {
  const [plate, setPlate] = useState("ABC-1D23");
  const [status, setStatus] = useState<Status>("idle");
  const [vehicle, setVehicle] = useState<PlateLookupResult | null>(null);
  const [quote, setQuote] = useState<FipeQuote | null>(null);
  const [error, setError] = useState("");

  const run = async () => {
    setStatus("loading");
    setVehicle(null);
    setQuote(null);
    try {
      const found = await plateLookup.lookup(plate);
      setVehicle(found);
      if (found.fipeCode && found.fipeYearCode) setQuote(await fipeApi.getQuoteByCode(found.fipeCode, found.fipeYearCode));
      setStatus("done");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Erro inesperado.");
      setStatus("error");
    }
  };

  const example = quote ? compareWithFipe(quote.price, Math.round(quote.price * 0.85)) : null;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <form
        className="flex flex-col gap-3"
        onSubmit={(event) => {
          event.preventDefault();
          void run();
        }}
      >
        <Input
          label="Placa (mock)"
          value={plate}
          onChange={(event) => setPlate(formatPlateInput(event.target.value))}
          hint="Teste ABC1D23, BRA2E19, qualquer placa válida, ou AAA0000 para o erro."
        />
        <Button type="submit" loading={status === "loading"}>
          {status === "loading" ? "Consultando..." : "Consultar placa + FIPE real"}
        </Button>
      </form>

      <div className="flex flex-col gap-3">
        {status === "error" && <Alert variant="danger">{error}</Alert>}
        {vehicle && (
          <Alert variant="info" title={`${vehicle.brand} ${vehicle.model} ${vehicle.version}`}>
            {vehicle.manufactureYear}/{vehicle.modelYear} · {vehicle.color} · FIPE {vehicle.fipeCode}
          </Alert>
        )}
        {quote && example?.kind === "below" && (
          <Alert
            variant="success"
            title={`FIPE ${formatBRL(quote.price)} (${quote.referenceMonth})`}
          >
            {quote.fromFallback ? "Valor do catálogo local (API fora do ar). " : "Valor da API Parallelum. "}
            Anunciando por {formatBRL(Math.round(quote.price * 0.85))}, o carro fica {example.percent}% abaixo
            da FIPE.
          </Alert>
        )}
      </div>
    </div>
  );
}
