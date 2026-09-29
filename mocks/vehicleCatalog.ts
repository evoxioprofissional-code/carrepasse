import type { BodyType, Fuel, Transmission } from "@/types/listing";

/**
 * Veículos com código e valor FIPE reais (Parallelum, referência
 * setembro de 2026). Usado pelos anúncios de demonstração, pelo mock
 * de placa e como plano B quando a API FIPE não responde.
 */
export interface CatalogVehicle {
  key: string;
  brand: string;
  model: string;
  version: string;
  modelYear: number;
  fuel: Fuel;
  transmission: Transmission;
  bodyType: BodyType;
  fipeCode: string;
  /** Código do ano na FIPE: "<ano>-<combustível>". */
  fipeYearCode: string;
  fipePrice: number;
  fipeModelName: string;
}

export const FIPE_REFERENCE_MONTH = "setembro de 2026";

export const VEHICLE_CATALOG: CatalogVehicle[] = [
  { key: "onix", brand: "Chevrolet", model: "Onix", version: "1.0 Flex Manual", modelYear: 2021, fuel: "flex", transmission: "manual", bodyType: "hatch", fipeCode: "004519-5", fipeYearCode: "2021-5", fipePrice: 59052, fipeModelName: "ONIX HATCH 1.0 12V Flex 5p Mec." },
  { key: "onix-plus", brand: "Chevrolet", model: "Onix Plus", version: "1.0 Turbo Automático", modelYear: 2022, fuel: "flex", transmission: "automatico", bodyType: "sedan", fipeCode: "004499-7", fipeYearCode: "2022-5", fipePrice: 69856, fipeModelName: "ONIX SEDAN Plus 1.0 12V TB Flex Aut." },
  { key: "tracker", brand: "Chevrolet", model: "Tracker", version: "1.0 Turbo Automático", modelYear: 2023, fuel: "flex", transmission: "automatico", bodyType: "suv", fipeCode: "004526-8", fipeYearCode: "2023-5", fipePrice: 91789, fipeModelName: "TRACKER 1.0 Turbo 12V Flex Aut." },
  { key: "s10", brand: "Chevrolet", model: "S10", version: "2.8 100 Years 4x4 CD Diesel", modelYear: 2018, fuel: "diesel", transmission: "automatico", bodyType: "picape", fipeCode: "004485-7", fipeYearCode: "2018-3", fipePrice: 159883, fipeModelName: "S10 P.Up 100YEARS 2.8 4x4 CD Dies. Aut." },
  { key: "onix-2014", brand: "Chevrolet", model: "Onix", version: "1.4 LT Manual", modelYear: 2014, fuel: "flex", transmission: "manual", bodyType: "hatch", fipeCode: "004425-3", fipeYearCode: "2014-5", fipePrice: 45677, fipeModelName: "ONIX HATCH LT 1.4 8V FlexPower 5p Mec." },
  { key: "hb20", brand: "Hyundai", model: "HB20", version: "1.0 Turbo Diamond Automático", modelYear: 2020, fuel: "flex", transmission: "automatico", bodyType: "hatch", fipeCode: "015171-8", fipeYearCode: "2020-5", fipePrice: 73203, fipeModelName: "HB20 Diamond 1.0 TB Flex 12V Aut." },
  { key: "hb20-2024", brand: "Hyundai", model: "HB20", version: "1.0 Comfort Manual", modelYear: 2024, fuel: "flex", transmission: "manual", bodyType: "hatch", fipeCode: "015215-3", fipeYearCode: "2024-5", fipePrice: 70180, fipeModelName: "HB20 Comfort 1.0 Flex 12V Mec." },
  { key: "creta", brand: "Hyundai", model: "Creta", version: "1.6 Action Automático", modelYear: 2021, fuel: "flex", transmission: "automatico", bodyType: "suv", fipeCode: "015190-4", fipeYearCode: "2021-5", fipePrice: 88153, fipeModelName: "Creta Action 1.6 16V Flex Aut." },
  { key: "gol", brand: "Volkswagen", model: "Gol", version: "1.0 Track", modelYear: 2018, fuel: "flex", transmission: "manual", bodyType: "hatch", fipeCode: "005469-0", fipeYearCode: "2018-5", fipePrice: 47648, fipeModelName: "Gol TRACK 1.0 Total Flex 12V 5p" },
  { key: "gol-2012", brand: "Volkswagen", model: "Gol", version: "1.6 Power 4 portas", modelYear: 2012, fuel: "flex", transmission: "manual", bodyType: "hatch", fipeCode: "005277-9", fipeYearCode: "2012-5", fipePrice: 32296, fipeModelName: "Gol (novo) 1.6 Power/Highi T.Flex 8v 4P" },
  { key: "polo", brand: "Volkswagen", model: "Polo", version: "200 TSI Comfortline Automático", modelYear: 2022, fuel: "flex", transmission: "automatico", bodyType: "hatch", fipeCode: "005477-1", fipeYearCode: "2022-5", fipePrice: 83923, fipeModelName: "Polo Comfort. 200 TSI 1.0 Flex 12V Aut." },
  { key: "t-cross", brand: "Volkswagen", model: "T-Cross", version: "200 TSI Automático", modelYear: 2023, fuel: "flex", transmission: "automatico", bodyType: "suv", fipeCode: "005510-7", fipeYearCode: "2023-5", fipePrice: 98777, fipeModelName: "T-Cross 200 TSI 1.0 Flex 12V 5p Aut." },
  { key: "virtus", brand: "Volkswagen", model: "Virtus", version: "200 TSI Comfortline Automático", modelYear: 2021, fuel: "flex", transmission: "automatico", bodyType: "sedan", fipeCode: "005485-2", fipeYearCode: "2021-5", fipePrice: 78106, fipeModelName: "VIRTUS Comfort. 200 TSI 1.0 Flex 12V Aut" },
  { key: "strada", brand: "Fiat", model: "Strada", version: "1.3 Freedom Cabine Dupla", modelYear: 2022, fuel: "flex", transmission: "manual", bodyType: "picape", fipeCode: "001530-0", fipeYearCode: "2022-5", fipePrice: 89151, fipeModelName: "Strada Freedom 1.3 Flex 8V CD" },
  { key: "argo", brand: "Fiat", model: "Argo", version: "1.0 Firefly", modelYear: 2020, fuel: "flex", transmission: "manual", bodyType: "hatch", fipeCode: "001509-1", fipeYearCode: "2020-5", fipePrice: 51159, fipeModelName: "ARGO 1.0 6V Flex" },
  { key: "toro", brand: "Fiat", model: "Toro", version: "2.0 Endurance 4x4 Diesel", modelYear: 2020, fuel: "diesel", transmission: "automatico", bodyType: "picape", fipeCode: "001520-2", fipeYearCode: "2020-3", fipePrice: 93446, fipeModelName: "Toro Endurance 2.0 16V 4x4 Diesel Aut." },
  { key: "mobi", brand: "Fiat", model: "Mobi", version: "1.0 Drive", modelYear: 2019, fuel: "flex", transmission: "manual", bodyType: "hatch", fipeCode: "001480-0", fipeYearCode: "2019-5", fipePrice: 43034, fipeModelName: "MOBI DRIVE 1.0 Flex 6V 5p" },
  { key: "cronos", brand: "Fiat", model: "Cronos", version: "1.3 Drive", modelYear: 2023, fuel: "flex", transmission: "manual", bodyType: "sedan", fipeCode: "001505-9", fipeYearCode: "2023-5", fipePrice: 73262, fipeModelName: "CRONOS DRIVE 1.3 8V Flex" },
  { key: "compass", brand: "Jeep", model: "Compass", version: "2.0 Longitude Automático", modelYear: 2019, fuel: "flex", transmission: "automatico", bodyType: "suv", fipeCode: "017046-1", fipeYearCode: "2019-5", fipePrice: 90507, fipeModelName: "COMPASS LONGITUDE 2.0 4x2 Flex 16V Aut." },
  { key: "renegade", brand: "Jeep", model: "Renegade", version: "1.8 Automático", modelYear: 2018, fuel: "flex", transmission: "automatico", bodyType: "suv", fipeCode: "017062-3", fipeYearCode: "2018-5", fipePrice: 66973, fipeModelName: "Renegade 1.8 4x2 Flex 16V Aut." },
  { key: "corolla", brand: "Toyota", model: "Corolla", version: "2.0 XEi Automático", modelYear: 2020, fuel: "flex", transmission: "cvt", bodyType: "sedan", fipeCode: "002111-3", fipeYearCode: "2020-5", fipePrice: 114373, fipeModelName: "Corolla XEi 2.0 Flex 16V Aut." },
  { key: "hilux", brand: "Toyota", model: "Hilux", version: "2.8 SRV 4x4 CD Diesel", modelYear: 2019, fuel: "diesel", transmission: "automatico", bodyType: "picape", fipeCode: "002143-1", fipeYearCode: "2019-3", fipePrice: 179514, fipeModelName: "Hilux CD SRV 4x4 2.8 TDI Diesel Aut." },
  { key: "yaris", brand: "Toyota", model: "Yaris", version: "1.5 S Automático", modelYear: 2021, fuel: "flex", transmission: "cvt", bodyType: "hatch", fipeCode: "002198-9", fipeYearCode: "2021-5", fipePrice: 84212, fipeModelName: "YARIS S 1.5 Flex 16V 5p Aut." },
  { key: "corolla-cross", brand: "Toyota", model: "Corolla Cross", version: "2.0 XRE Automático", modelYear: 2022, fuel: "flex", transmission: "cvt", bodyType: "suv", fipeCode: "002203-9", fipeYearCode: "2022-5", fipePrice: 127400, fipeModelName: "Corolla Cross XRE 2.0 16V Flex Aut." },
  { key: "civic", brand: "Honda", model: "Civic", version: "2.0 EXL Automático", modelYear: 2018, fuel: "flex", transmission: "cvt", bodyType: "sedan", fipeCode: "014090-2", fipeYearCode: "2018-5", fipePrice: 106684, fipeModelName: "Civic Sedan EXL 2.0 Flex 16V Aut.4p" },
  { key: "hr-v", brand: "Honda", model: "HR-V", version: "1.8 EX Automático", modelYear: 2019, fuel: "flex", transmission: "cvt", bodyType: "suv", fipeCode: "014087-2", fipeYearCode: "2019-5", fipePrice: 98707, fipeModelName: "HR-V EX 1.8 Flexone 16V 5p Aut." },
  { key: "kwid", brand: "Renault", model: "Kwid", version: "1.0 Intense", modelYear: 2021, fuel: "flex", transmission: "manual", bodyType: "hatch", fipeCode: "025267-0", fipeYearCode: "2021-5", fipePrice: 41533, fipeModelName: "KWID Intense 1.0 Flex 12V 5p Mec." },
  { key: "duster", brand: "Renault", model: "Duster", version: "1.6 Authentique Automático", modelYear: 2018, fuel: "flex", transmission: "cvt", bodyType: "suv", fipeCode: "025274-3", fipeYearCode: "2018-5", fipePrice: 63249, fipeModelName: "DUSTER Authent. 1.6 Flex 16V Aut." },
  { key: "kicks", brand: "Nissan", model: "Kicks", version: "1.6 S Automático", modelYear: 2020, fuel: "flex", transmission: "cvt", bodyType: "suv", fipeCode: "023156-8", fipeYearCode: "2020-5", fipePrice: 78510, fipeModelName: "KICKS S 1.6 16V Flex 5p Aut." },
];

export function catalogVehicle(key: string): CatalogVehicle {
  const vehicle = VEHICLE_CATALOG.find((item) => item.key === key);
  if (!vehicle) throw new Error(`Veículo "${key}" não está no catálogo de demonstração.`);
  return vehicle;
}
