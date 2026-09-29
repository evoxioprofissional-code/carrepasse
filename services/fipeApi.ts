import { simulateLatency } from "@/lib/latency";
import { FIPE_REFERENCE_MONTH, VEHICLE_CATALOG } from "@/mocks/vehicleCatalog";
import type { FipeOption, FipeQuote } from "@/types/fipe";

// API pública da Parallelum (tabela FIPE). Se ela falhar ou demorar, usamos
// o catálogo local para o fluxo de anúncio não travar.
const V1 = "https://parallelum.com.br/fipe/api/v1/carros";
const V2 = "https://parallelum.com.br/fipe/api/v2/cars";
const TIMEOUT_MS = 8000;

const cache = new Map<string, unknown>();

async function fetchJson<T>(url: string): Promise<T> {
  if (cache.has(url)) return cache.get(url) as T;
  const response = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) });
  if (!response.ok) throw new Error(`FIPE respondeu ${response.status}`);
  const data = (await response.json()) as T;
  cache.set(url, data);
  return data;
}

/** "R$ 59.052,00" → 59052 */
export function parseFipePrice(value: string): number {
  const normalized = value.replace(/[^\d,]/g, "").replace(",", ".");
  return Math.round(Number(normalized));
}

interface V1Option {
  codigo: string | number;
  nome: string;
}

interface V1Quote {
  Valor: string;
  Marca: string;
  Modelo: string;
  AnoModelo: number;
  Combustivel: string;
  CodigoFipe: string;
  MesReferencia: string;
}

interface V2Quote {
  price: string;
  brand: string;
  model: string;
  modelYear: number;
  fuel: string;
  codeFipe: string;
  referenceMonth: string;
}

const toOption = (item: V1Option): FipeOption => ({ code: String(item.codigo), name: item.nome });

// Plano B: opções derivadas do catálogo local (códigos locais, prefixo "local:").
function fallbackBrands(): FipeOption[] {
  return [...new Set(VEHICLE_CATALOG.map((vehicle) => vehicle.brand))]
    .sort()
    .map((brand) => ({ code: `local:${brand}`, name: brand }));
}

function fallbackQuoteByCode(fipeCode: string, yearCode: string): FipeQuote {
  const vehicle = VEHICLE_CATALOG.find(
    (item) => item.fipeCode === fipeCode && item.fipeYearCode === yearCode,
  );
  if (!vehicle) throw new Error("Veículo não encontrado na tabela FIPE.");
  return {
    fipeCode: vehicle.fipeCode,
    brand: vehicle.brand,
    model: vehicle.fipeModelName,
    modelYear: vehicle.modelYear,
    fuel: vehicle.fuel,
    price: vehicle.fipePrice,
    referenceMonth: FIPE_REFERENCE_MONTH,
    fromFallback: true,
  };
}

export const fipeApi = {
  async getBrands(): Promise<FipeOption[]> {
    try {
      const data = await fetchJson<V1Option[]>(`${V1}/marcas`);
      return data.map(toOption);
    } catch {
      await simulateLatency();
      return fallbackBrands();
    }
  },

  async getModels(brandCode: string): Promise<FipeOption[]> {
    if (brandCode.startsWith("local:")) {
      const brand = brandCode.slice("local:".length);
      return VEHICLE_CATALOG.filter((item) => item.brand === brand).map((item) => ({
        code: `local:${item.key}`,
        name: `${item.model} ${item.version}`,
      }));
    }
    const data = await fetchJson<{ modelos: V1Option[] }>(`${V1}/marcas/${brandCode}/modelos`);
    return data.modelos.map(toOption);
  },

  async getYears(brandCode: string, modelCode: string): Promise<FipeOption[]> {
    if (modelCode.startsWith("local:")) {
      const vehicle = VEHICLE_CATALOG.find((item) => `local:${item.key}` === modelCode);
      return vehicle ? [{ code: vehicle.fipeYearCode, name: String(vehicle.modelYear) }] : [];
    }
    const data = await fetchJson<V1Option[]>(`${V1}/marcas/${brandCode}/modelos/${modelCode}/anos`);
    // "32000" é como a FIPE marca veículo zero km.
    return data.map(toOption).map((option) => ({
      ...option,
      name: option.name.replace(/^32000/, "Zero km"),
    }));
  },

  async getQuote(brandCode: string, modelCode: string, yearCode: string): Promise<FipeQuote> {
    if (modelCode.startsWith("local:")) {
      const vehicle = VEHICLE_CATALOG.find((item) => `local:${item.key}` === modelCode);
      if (!vehicle) throw new Error("Veículo não encontrado na tabela FIPE.");
      return fallbackQuoteByCode(vehicle.fipeCode, vehicle.fipeYearCode);
    }
    const data = await fetchJson<V1Quote>(
      `${V1}/marcas/${brandCode}/modelos/${modelCode}/anos/${yearCode}`,
    );
    return {
      fipeCode: data.CodigoFipe,
      brand: data.Marca,
      model: data.Modelo,
      modelYear: data.AnoModelo,
      fuel: data.Combustivel,
      price: parseFipePrice(data.Valor),
      referenceMonth: data.MesReferencia,
      fromFallback: false,
    };
  },

  /** Consulta direta pelo código FIPE (usada depois da consulta de placa). */
  async getQuoteByCode(fipeCode: string, yearCode: string): Promise<FipeQuote> {
    try {
      const data = await fetchJson<V2Quote>(`${V2}/${fipeCode}/years/${yearCode}`);
      return {
        fipeCode: data.codeFipe,
        brand: data.brand,
        model: data.model,
        modelYear: data.modelYear,
        fuel: data.fuel,
        price: parseFipePrice(data.price),
        referenceMonth: data.referenceMonth,
        fromFallback: false,
      };
    } catch {
      await simulateLatency();
      return fallbackQuoteByCode(fipeCode, yearCode);
    }
  },
};
