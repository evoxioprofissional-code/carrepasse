import { simulateLatency } from "@/lib/latency";
import { VEHICLE_CATALOG, catalogVehicle } from "@/mocks/vehicleCatalog";
import type { PlateLookupResult } from "@/types/fipe";

// SIMULAÇÃO usada enquanto não há token da API de placas (API_PLACAS_TOKEN).
// 15 placas têm carro fixo e qualquer outra placa válida gera um carro de
// forma determinística (a mesma placa sempre devolve o mesmo).

const FIXED_PLATES: Record<string, { vehicle: string; color: string }> = {
  ABC1D23: { vehicle: "onix", color: "Prata" },
  BRA2E19: { vehicle: "hb20", color: "Branco" },
  CAR0R26: { vehicle: "t-cross", color: "Cinza" },
  REP4S55: { vehicle: "strada", color: "Vermelho" },
  PCZ4H21: { vehicle: "onix", color: "Prata" },
  QPH6D20: { vehicle: "corolla", color: "Prata" },
  FXT3A19: { vehicle: "compass", color: "Preto" },
  OUV4K19: { vehicle: "hilux", color: "Prata" },
  JQX2E18: { vehicle: "gol", color: "Branco" },
  RGA5J21: { vehicle: "kwid", color: "Branco" },
  GCD5N22: { vehicle: "polo", color: "Azul" },
  PKR1R20: { vehicle: "toro", color: "Branco" },
  QFJ1G18: { vehicle: "civic", color: "Preto" },
  ABC1234: { vehicle: "gol-2012", color: "Prata" },
  XYZ9876: { vehicle: "renegade", color: "Vermelho" },
};

const COLORS = ["Branco", "Prata", "Preto", "Cinza", "Vermelho", "Azul"];

/** Placa "de teste" para exercitar o estado de "não encontrada". */
export const MOCK_NOT_FOUND_PLATE = "AAA0000";

/** Hash simples e estável (FNV-1a) para escolher um carro pela placa. */
function hashPlate(plate: string): number {
  let hash = 2166136261;
  for (const char of plate) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

/** Placa já normalizada e válida. null = não encontrada. */
export async function mockPlateLookup(plate: string): Promise<PlateLookupResult | null> {
  await simulateLatency(900, 1600);
  if (plate === MOCK_NOT_FOUND_PLATE) return null;

  const hash = hashPlate(plate);
  const fixed = FIXED_PLATES[plate];
  const vehicle = fixed ? catalogVehicle(fixed.vehicle) : VEHICLE_CATALOG[hash % VEHICLE_CATALOG.length];

  return {
    plate,
    brand: vehicle.brand,
    model: vehicle.model,
    version: vehicle.version,
    modelYear: vehicle.modelYear,
    manufactureYear: hash % 3 === 0 ? vehicle.modelYear - 1 : vehicle.modelYear,
    fuel: vehicle.fuel,
    transmission: vehicle.transmission,
    bodyType: vehicle.bodyType,
    color: fixed?.color ?? COLORS[(hash >>> 8) % COLORS.length],
    fipeCode: vehicle.fipeCode,
    fipeYearCode: vehicle.fipeYearCode,
    source: "simulado",
  };
}
