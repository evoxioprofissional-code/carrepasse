import { isValidPlate, normalizePlate } from "@/lib/plate";
import type { PlateLookupResult } from "@/types/fipe";

// Consulta de placa no navegador: chama a rota /api/placa, que usa a API
// paga (com token no servidor) ou a simulação, se não houver token.

export class PlateNotFoundError extends Error {
  constructor(message = "Não encontramos essa placa. Confira os caracteres ou preencha pela tabela FIPE.") {
    super(message);
    this.name = "PlateNotFoundError";
  }
}

export class InvalidPlateError extends Error {
  constructor() {
    super("Placa inválida. Use o formato ABC1D23 (Mercosul) ou ABC-1234.");
    this.name = "InvalidPlateError";
  }
}

export const plateLookup = {
  async lookup(rawPlate: string): Promise<PlateLookupResult> {
    const plate = normalizePlate(rawPlate);
    if (!isValidPlate(plate)) throw new InvalidPlateError();

    let response: Response;
    try {
      response = await fetch("/api/placa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plate }),
        signal: AbortSignal.timeout(20_000),
      });
    } catch {
      throw new Error("Sem conexão para consultar a placa. Verifique sua internet.");
    }

    const data = (await response.json().catch(() => ({}))) as PlateLookupResult & { message?: string };
    if (response.ok) return data;
    if (response.status === 404) throw new PlateNotFoundError(data.message);
    throw new Error(data.message ?? "Não foi possível consultar a placa agora.");
  },
};
