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
  fuel: Fuel;
  transmission: Transmission;
  bodyType: BodyType;
  color: string;
  fipeCode: string;
  /** Código do ano na FIPE, ex.: "2021-5". */
  fipeYearCode: string;
}
