import { guessTransmission, mapFipeFuel, normalizeBrand, splitFipeModel } from "@/lib/fipe-names";
import { parseFipePrice } from "@/services/fipeApi";
import type { PlateLookupResult } from "@/types/fipe";

// SÓ NO SERVIDOR: API Placas (wdapi2.com.br), com o token em API_PLACAS_TOKEN.
// Formato: GET https://wdapi2.com.br/consulta/{placa}/{token} → JSON.
// A leitura é defensiva (todo campo é opcional) e dados do proprietário
// nunca são repassados ao navegador.

const BASE = "https://wdapi2.com.br/consulta";
const TIMEOUT_MS = 10_000;

interface FipeEntry {
  codigo_fipe?: string;
  texto_marca?: string;
  texto_modelo?: string;
  texto_valor?: string;
  mes_referencia?: string;
  combustivel?: string;
  ano_modelo?: string | number;
  score?: number;
}

interface ApiPlacasResponse {
  MARCA?: string;
  MODELO?: string;
  VERSAO?: string;
  ano?: string | number;
  anoModelo?: string | number;
  cor?: string;
  combustivel?: string;
  extra?: { combustivel?: string; tipo_veiculo?: string; especie?: string };
  fipe?: { dados?: FipeEntry[] };
  message?: string;
}

export class PlateProviderError extends Error {
  constructor(
    message: string,
    /** Falha de configuração (token inválido/sem saldo): cai na simulação. */
    readonly configuration = false,
  ) {
    super(message);
    this.name = "PlateProviderError";
  }
}

function toYear(value: string | number | undefined): number | undefined {
  const year = Number(String(value ?? "").slice(0, 4));
  return year >= 1950 && year <= 2100 ? year : undefined;
}

function titleColor(value: string | undefined): string {
  const color = (value ?? "").trim().toLowerCase();
  return color ? color.charAt(0).toUpperCase() + color.slice(1) : "";
}

/** Placa já normalizada e válida. null = placa não encontrada na base. */
export async function apiPlacasLookup(plate: string, token: string): Promise<PlateLookupResult | null> {
  let response: Response;
  try {
    response = await fetch(`${BASE}/${plate}/${encodeURIComponent(token)}`, {
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: "no-store",
    });
  } catch {
    throw new PlateProviderError("A consulta de placa não respondeu.");
  }

  const data = (await response.json().catch(() => ({}))) as ApiPlacasResponse;
  const message = (data.message ?? "").toLowerCase();

  if (response.status === 404 || message.includes("não encontrad") || message.includes("nao encontrad")) return null;
  if (response.status === 401 || response.status === 402 || response.status === 403 || message.includes("token") || message.includes("saldo")) {
    throw new PlateProviderError(`API Placas recusou o token (${response.status}).`, true);
  }
  if (!response.ok) throw new PlateProviderError(`API Placas respondeu ${response.status}.`);

  // Entre as opções FIPE, a de maior "score" é a que melhor bate com o carro.
  const fipe = [...(data.fipe?.dados ?? [])].sort((a, b) => (b.score ?? 0) - (a.score ?? 0))[0];
  const fipeModel = fipe?.texto_modelo ?? "";
  const split = fipeModel ? splitFipeModel(fipeModel) : null;

  const modelYear = toYear(data.anoModelo) ?? toYear(fipe?.ano_modelo);
  const brand = normalizeBrand(fipe?.texto_marca ?? data.MARCA ?? "");
  const model = split?.model || (data.MODELO ?? "").trim();
  if (!modelYear || !brand || !model) return null;

  const price = fipe?.texto_valor ? parseFipePrice(fipe.texto_valor) : 0;
  const fuelText = fipe?.combustivel ?? data.extra?.combustivel ?? data.combustivel ?? "";

  return {
    plate,
    brand,
    model,
    version: split?.version || (data.VERSAO ?? "").trim(),
    modelYear,
    manufactureYear: toYear(data.ano) ?? modelYear,
    fuel: mapFipeFuel(fuelText),
    transmission: guessTransmission(fipeModel),
    color: titleColor(data.cor),
    fipeCode: fipe?.codigo_fipe,
    fipe: price > 0 ? { price, referenceMonth: (fipe?.mes_referencia ?? "").trim() } : undefined,
    source: "api",
  };
}
