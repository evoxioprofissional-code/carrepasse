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
    cilindradas?: string;
    combustivel?: string;
    especie?: string;
    nacionalidade?: string;
    quantidade_passageiro?: string;
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

/**
 * "Alcool / Gasolina" é flex; a FIPE costuma chamar carro flex de "Gasolina".
 * O combustível do registro (extra.combustivel) manda: diesel e flex vêm dele
 * ANTES de qualquer "flex" que apareça no texto do modelo FIPE (senão um carro
 * diesel virava "flex" só porque a versão flex do mesmo modelo existe na FIPE).
 */
function fuelFrom(plateFuel: string, fipeModel: string, fipeFuel: string): Fuel | undefined {
  const text = plateFuel.toLowerCase();
  if (/diesel/.test(text)) return "diesel";
  const alcohol = /alcool|álcool|etanol/.test(text);
  if (/flex/.test(text) || (alcohol && text.includes("gasolina"))) return "flex";
  const mapped = mapFipeFuel(plateFuel) ?? mapFipeFuel(fipeFuel);
  if (mapped) return mapped;
  if (/\bflex\b/i.test(fipeModel)) return "flex";
  return undefined;
}

/**
 * Escolhe a opção FIPE que bate com o combustível do registro (diesel ≠ flex)
 * e, entre as compatíveis, a de maior score. Evita puxar a versão flex 4x2
 * quando o carro é, na verdade, diesel 4x4.
 */
function pickFipe(dados: FipeEntry[], regFuel: string): FipeEntry | undefined {
  const byScore = (a: FipeEntry, b: FipeEntry) => (b.score ?? 0) - (a.score ?? 0);
  const diesel = /diesel/i.test(regFuel);
  const matches = dados.filter((entry) => {
    const sigla = (entry.sigla_combustivel ?? "").toUpperCase();
    return diesel ? sigla === "D" : sigla !== "D";
  });
  return [...(matches.length ? matches : dados)].sort(byScore)[0];
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

  // Opção FIPE que bate com o combustível do registro (e, entre elas, maior score).
  const fipe = pickFipe(data.fipe?.dados ?? [], extra.combustivel ?? "");
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
      engineCc: Number(extra.cilindradas) || undefined,
      seats: Number(extra.quantidade_passageiro) || undefined,
      origin: titleCase(extra.nacionalidade) || undefined,
      detranStatus: (data.situacao ?? "").trim() || undefined,
      source: "api",
    },
  };
}

/**
 * Guarda no cache SÓ o que o leitor usa — nunca dados do proprietário
 * (chassi, município, documentos, faturado…). Assim a resposta crua pode ser
 * reinterpretada depois sem reconsultar, e sem guardar dado sensível.
 */
export function sanitizeApiPlacas(data: ApiPlacasResponse): ApiPlacasResponse {
  const e = data.extra ?? {};
  return {
    MARCA: data.MARCA,
    MODELO: data.MODELO,
    VERSAO: data.VERSAO,
    ano: data.ano,
    anoModelo: data.anoModelo,
    codigoSituacao: data.codigoSituacao,
    cor: data.cor,
    situacao: data.situacao,
    extra: {
      ano_fabricacao: e.ano_fabricacao,
      ano_modelo: e.ano_modelo,
      caixa_cambio: e.caixa_cambio,
      cilindradas: e.cilindradas,
      combustivel: e.combustivel,
      especie: e.especie,
      nacionalidade: e.nacionalidade,
      quantidade_passageiro: e.quantidade_passageiro,
      sub_segmento: e.sub_segmento,
      tipo_carroceria: e.tipo_carroceria,
      tipo_veiculo: e.tipo_veiculo,
    },
    fipe: data.fipe ? { dados: data.fipe.dados } : undefined,
  };
}

/** Busca crua na API (sem interpretar). null = placa não encontrada (401/406). */
export async function fetchApiPlacas(plate: string, token: string): Promise<ApiPlacasResponse | null> {
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
  if (response.status === 401 || response.status === 406) return null;
  if (response.status === 402) throw new PlateProviderError("API Placas: token inválido.", true);
  if (response.status === 429) throw new PlateProviderError("API Placas: limite de consultas do plano atingido.", true);
  if (!response.ok) throw new PlateProviderError(`API Placas respondeu ${response.status}.`);

  const data = (await response.json().catch(() => null)) as ApiPlacasResponse | null;
  if (!data) throw new PlateProviderError("API Placas devolveu uma resposta inválida.");
  return data;
}

/** Placa já normalizada e válida. */
export async function apiPlacasLookup(plate: string, token: string): Promise<PlateParseResult> {
  const data = await fetchApiPlacas(plate, token);
  return data ? parseApiPlacas(plate, data) : { kind: "not-found" };
}
