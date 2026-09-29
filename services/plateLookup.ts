import { simulateLatency } from "@/lib/latency";
import { isValidPlate, normalizePlate } from "@/lib/plate";
import { VEHICLE_CATALOG, catalogVehicle } from "@/mocks/vehicleCatalog";
import type { PlateLookupResult } from "@/types/fipe";

// MOCK: consulta de placa real depende de provedor pago e backend.
// Aqui 15 placas têm carro fixo e qualquer outra placa válida gera um
// carro de forma determinística (a mesma placa sempre devolve o mesmo).

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

export class PlateNotFoundError extends Error {
  constructor() {
    super("Não encontramos essa placa. Confira os caracteres ou preencha os dados manualmente.");
    this.name = "PlateNotFoundError";
  }
}

export class InvalidPlateError extends Error {
  constructor() {
    super("Placa inválida. Use o formato ABC1D23 (Mercosul) ou ABC-1234.");
    this.name = "InvalidPlateError";
  }
}

/** Hash simples e estável (FNV-1a) para escolher um carro pela placa. */
function hashPlate(plate: string): number {
  let hash = 2166136261;
  for (const char of plate) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export const plateLookup = {
  async lookup(rawPlate: string): Promise<PlateLookupResult> {
    const plate = normalizePlate(rawPlate);
    if (!isValidPlate(plate)) throw new InvalidPlateError();

    await simulateLatency(900, 1600);

    // Placa "de teste" para exercitar o estado de erro.
    if (plate === "AAA0000") throw new PlateNotFoundError();

    const hash = hashPlate(plate);
    const fixed = FIXED_PLATES[plate];
    const vehicle = fixed
      ? catalogVehicle(fixed.vehicle)
      : VEHICLE_CATALOG[hash % VEHICLE_CATALOG.length];
    const color = fixed?.color ?? COLORS[(hash >>> 8) % COLORS.length];

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
      color,
      fipeCode: vehicle.fipeCode,
      fipeYearCode: vehicle.fipeYearCode,
    };
  },
};
