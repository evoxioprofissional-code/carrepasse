import type { Fuel, Transmission } from "@/types/listing";

// A tabela FIPE usa nomes como "GM - Chevrolet" e "ONIX HATCH 1.0 12V Flex 5p Mec.".
// Estas funções transformam isso em algo legível para o anúncio.

const BRAND_NAMES: Record<string, string> = {
  "GM - Chevrolet": "Chevrolet",
  "VW - VolksWagen": "Volkswagen",
  "Kia Motors": "Kia",
  "Citroën": "Citroën",
  "Mercedes-Benz": "Mercedes-Benz",
  "LAND ROVER": "Land Rover",
};

function titleCase(value: string): string {
  return value
    .toLowerCase()
    .split(/\s+/)
    .map((word) => (word.length <= 3 && /\d/.test(word) ? word : word.charAt(0).toUpperCase() + word.slice(1)))
    .join(" ");
}

export function normalizeBrand(fipeBrand: string): string {
  const trimmed = fipeBrand.trim();
  if (BRAND_NAMES[trimmed]) return BRAND_NAMES[trimmed];
  if (/^[A-Z0-9 -]+$/.test(trimmed) && trimmed.length > 3) return titleCase(trimmed);
  return trimmed;
}

/** "ONIX HATCH 1.0 12V Flex 5p Mec." → { model: "Onix", version: "Hatch 1.0 12V Flex 5p Mec." } */
export function splitFipeModel(fipeModel: string): { model: string; version: string } {
  const [first = "", ...rest] = fipeModel.trim().split(/\s+/);
  const model = /^[A-Z0-9-]+$/.test(first) && first.length > 2 ? titleCase(first) : first;
  const version = rest.map((word) => (/^[A-Z]{4,}$/.test(word) ? titleCase(word) : word)).join(" ");
  return { model, version };
}

export function guessTransmission(fipeModel: string): Transmission | undefined {
  if (/\bCVT\b/i.test(fipeModel)) return "cvt";
  if (/\bAut/i.test(fipeModel)) return "automatico";
  if (/\bMec/i.test(fipeModel)) return "manual";
  return undefined;
}

export function mapFipeFuel(fipeFuel: string): Fuel | undefined {
  const value = fipeFuel.toLowerCase();
  if (value.includes("flex")) return "flex";
  if (value.includes("diesel")) return "diesel";
  if (value.includes("gasolina")) return "gasolina";
  if (value.includes("álcool") || value.includes("alcool") || value.includes("etanol")) return "etanol";
  if (value.includes("híbrido") || value.includes("hibrido")) return "hibrido";
  if (value.includes("elétrico") || value.includes("eletrico")) return "eletrico";
  return undefined;
}

/** "2021-5" → 2021 (32000 = zero km → ano atual). */
export function yearFromFipeCode(yearCode: string): number {
  const year = Number(yearCode.split("-")[0]);
  return year === 32000 ? new Date().getFullYear() : year;
}
