import { guessTransmission, mapFipeFuel, normalizeBrand, splitFipeModel } from "@/lib/fipe-names";
import type { BodyType, Fuel, Transmission } from "@/types/listing";
import type { PlateLookupResult } from "@/types/fipe";

// SÓ NO SERVIDOR: API Placas (wdapi2.com.br), com o token em API_PLACAS_TOKEN.
// GET https://wdapi2.com.br/consulta/{placa}/{token} → JSON (doc: apiplacas.com.br/doc.php).
// Dados do proprietário (tipo_doc_prop, faturado...) nunca saem daqui.

const BASE = process.env.API_PLACAS_URL ?? "https://wdapi2.com.br";
const TIMEOUT_MS = 10_000;

interface FipeEntry {
  ano_modelo?: string | number;
  codigo_fipe?: string;
  combustivel?: string;
  mes_referencia?: string;
  score?: number;
  sigla_combustivel?: string;
  texto_marca?: string;
  texto_modelo?: string;
  texto_valor?: string;
}

export interface ApiPlacasResponse {
  MARCA?: string;
  MODELO?: string;
  VERSAO?: string;
  ano?: string;
  anoModelo?: string;
  codigoSituacao?: string;
  cor?: string;
  situacao?: string;
  extra?: {
    ano_fabricacao?: string;
    ano_modelo?: string;
    caixa_cambio?: string;
    combustivel?: string;
    especie?: string;
    sub_segmento?: string;
    tipo_carroceria?: string;
    tipo_veiculo?: string;
  };
  fipe?: { dados?: FipeEntry[] };
  message?: string;
}

export type PlateParseResult =
  | { kind: "ok"; result: PlateLookupResult }
  | { kind: "not-found" }
  /** Moto, caminhão, ônibus...: o Car Repasse é só de carros. */
  | { kind: "not-car" }
  /** Registro de roubo ou furto: não pode ser anunciado. */
  | { kind: "stolen" };

export class PlateProviderError extends Error {
  constructor(
    message: string,
    /** Token inválido ou limite do plano: avisar a equipe. */
    readonly configuration = false,
  ) {
    super(message);
    this.name = "PlateProviderError";
  }
}

// Código do combustível no "código do ano" da FIPE (ex.: 2021-1).
const FIPE_FUEL_CODE: Record<string, string> = { G: "1", A: "2", D: "3" };

function toYear(value: string | number | undefined): number | undefined {
  const year = Number(String(value ?? "").slice(0, 4));
  return year >= 1950 && year <= 2100 ? year : undefined;
}

function titleCase(value: string | undefined): string {
  return (value ?? "")
    .trim()
    .toLowerCase()
    .replace(/(^|\s)\S/g, (letter) => letter.toUpperCase());
}

/** "Alcool / Gasolina" é flex; a FIPE costuma chamar carro flex de "Gasolina". */
function fuelFrom(plateFuel: string, fipeModel: string, fipeFuel: string): Fuel | undefined {
  const text = plateFuel.toLowerCase();
  const alcohol = /alcool|álcool|etanol/.test(text);
  if (/flex/.test(text) || (alcohol && text.includes("gasolina")) || /\bflex\b/i.test(fipeModel)) return "flex";
  return mapFipeFuel(plateFuel) ?? mapFipeFuel(fipeFuel);
}

function transmissionFrom(gearbox: string, fipeModel: string): Transmission | undefined {
  const text = gearbox.toLowerCase();
  if (text.includes("cvt")) return "cvt";
  if (text.includes("automatizad")) return "automatizado";
  if (text.includes("automat")) return "automatico";
  if (text.includes("manual") || text.includes("mecan")) return "manual";
  return guessTransmission(fipeModel);
}

/** sub_segmento "AU - HATCH PEQUENO", "AU - SEDAN MEDIO", "AU - SUV"... */
function bodyTypeFrom(subSegment: string, vehicleType: string, bodyText: string): BodyType | undefined {
  const text = `${subSegment} ${vehicleType} ${bodyText}`.toUpperCase();
  if (/PICK-?UP|PICAPE|CAMINHONETE|CABINE/.test(text)) return "picape";
  if (/SUV|UTILITARIO ESPORTIVO|JIPE|JEEP|CAMIONETA/.test(text)) return "suv";
  if (/SEDAN|SEDA\b|SEDÃ/.test(text)) return "sedan";
  if (/HATCH/.test(text)) return "hatch";
  return undefined;
}

/** Converte a resposta da API em dados do anúncio (função pura, testável). */
export function parseApiPlacas(plate: string, data: ApiPlacasResponse): PlateParseResult {
  const extra = data.extra ?? {};
  const vehicleType = extra.tipo_veiculo ?? "";
  if (/moto|ciclomotor|triciclo|quadriciclo|caminh[aã]o\b|onibus|ônibus|micro-?onibus|reboque|semi-?reboque|trator/i.test(vehicleType)) {
    return { kind: "not-car" };
  }
  if ((data.codigoSituacao ?? "0") !== "0" && /roubo|furto/i.test(data.situacao ?? "")) return { kind: "stolen" };

  // Entre as opções FIPE, a de maior "score" é a que melhor bate com o carro.
  const fipe = [...(data.fipe?.dados ?? [])].sort((a, b) => (b.score ?? 0) - (a.score ?? 0))[0];
  const fipeModel = fipe?.texto_modelo?.trim() ?? "";
  const split = fipeModel ? splitFipeModel(fipeModel) : null;

  const modelYear = toYear(data.anoModelo) ?? toYear(extra.ano_modelo) ?? toYear(fipe?.ano_modelo);
  const brand = normalizeBrand(fipe?.texto_marca ?? data.MARCA ?? "");
  const model = split?.model || titleCase(data.MODELO);
  if (!modelYear || !brand || !model) return { kind: "not-found" };

  const fipeYear = toYear(fipe?.ano_modelo);
  const fuelCode = FIPE_FUEL_CODE[(fipe?.sigla_combustivel ?? "").toUpperCase()];
  const price = fipe?.texto_valor ? Math.round(Number(fipe.texto_valor.replace(/[^\d,]/g, "").replace(",", "."))) : 0;

  return {
    kind: "ok",
    result: {
      plate,
      brand,
      model,
      version: split?.version || titleCase(data.VERSAO),
      modelYear,
      manufactureYear: toYear(extra.ano_fabricacao) ?? toYear(data.ano) ?? modelYear,
      fuel: fuelFrom(extra.combustivel ?? "", fipeModel, fipe?.combustivel ?? ""),
      transmission: transmissionFrom(extra.caixa_cambio ?? "", fipeModel),
      bodyType: bodyTypeFrom(extra.sub_segmento ?? "", vehicleType, extra.tipo_carroceria ?? ""),
      color: titleCase(data.cor),
      fipeCode: fipe?.codigo_fipe,
      // Com o código do ano, o navegador busca a FIPE do mês na tabela pública.
      fipeYearCode: fipeYear && fuelCode ? `${fipeYear}-${fuelCode}` : undefined,
      // Plano B: o valor que veio na consulta (pode ser de um mês anterior).
      fipe: price > 0 ? { price, referenceMonth: (fipe?.mes_referencia ?? "").trim() } : undefined,
      source: "api",
    },
  };
}

/** Placa já normalizada e válida. */
export async function apiPlacasLookup(plate: string, token: string): Promise<PlateParseResult> {
  let response: Response;
  try {
    response = await fetch(`${BASE}/consulta/${plate}/${encodeURIComponent(token)}`, {
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: "no-store",
    });
  } catch {
    throw new PlateProviderError("A consulta de placa não respondeu.");
  }

  // Códigos da API Placas: 401 placa inválida, 402 token inválido,
  // 406 sem resultados, 429 limite de consultas do plano.
  if (response.status === 401 || response.status === 406) return { kind: "not-found" };
  if (response.status === 402) throw new PlateProviderError("API Placas: token inválido.", true);
  if (response.status === 429) throw new PlateProviderError("API Placas: limite de consultas do plano atingido.", true);
  if (!response.ok) throw new PlateProviderError(`API Placas respondeu ${response.status}.`);

  const data = (await response.json().catch(() => null)) as ApiPlacasResponse | null;
  if (!data) throw new PlateProviderError("API Placas devolveu uma resposta inválida.");
  return parseApiPlacas(plate, data);
}
