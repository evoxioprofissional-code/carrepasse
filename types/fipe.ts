import type { BodyType, Fuel, Transmission } from "./listing";

export interface FipeOption {
  code: string;
  name: string;
}

export interface FipeQuote {
  fipeCode: string;
  brand: string;
  model: string;
  modelYear: number;
  fuel: string;
  price: number;
  referenceMonth: string;
  /** true quando a API falhou e o valor veio do mock local. */
  fromFallback: boolean;
}

export interface PlateLookupResult {
  plate: string;
  brand: string;
  model: string;
  version: string;
  modelYear: number;
  manufactureYear: number;
  /** Nem todo provedor informa; o vendedor completa na tela de correção. */
  fuel?: Fuel;
  transmission?: Transmission;
  bodyType?: BodyType;
  color: string;
  fipeCode?: string;
  /** Código do ano na FIPE, ex.: "2021-5" (para consultar a FIPE depois). */
  fipeYearCode?: string;
  /** Valor FIPE já devolvido pelo provedor da placa (evita outra consulta). */
  fipe?: { price: number; referenceMonth: string };
  /** Extras técnicos da API (exibidos quando vêm). */
  engineCc?: number;
  seats?: number;
  /** Nacional / Importado. */
  origin?: string;
  /** Situação no Detran (ex.: "Sem restrição"). */
  detranStatus?: string;
  /** "api" = consulta real; "simulado" = sem token configurado. */
  source: "api" | "simulado";
}
