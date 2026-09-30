import type { BodyType, Fuel, ListingSort, PriceMode, Transmission } from "@/types/listing";
import type { ReportReason } from "@/types/report";
import type { SellerType } from "@/types/user";

export const SELLER_TYPE_LABEL: Record<SellerType, string> = {
  lojista: "Lojista",
  corretor: "Corretor",
  particular: "Particular",
};

export const PRICE_MODE_LABEL: Record<PriceMode, string> = {
  repasse: "Repasse",
  final: "Preço final",
  ambos: "Repasse + final",
};

export const FUEL_LABEL: Record<Fuel, string> = {
  flex: "Flex",
  gasolina: "Gasolina",
  etanol: "Etanol",
  diesel: "Diesel",
  hibrido: "Híbrido",
  eletrico: "Elétrico",
};

export const TRANSMISSION_LABEL: Record<Transmission, string> = {
  manual: "Manual",
  automatico: "Automático",
  cvt: "CVT",
  automatizado: "Automatizado",
};

export const BODY_TYPE_LABEL: Record<BodyType, string> = {
  hatch: "Hatch",
  sedan: "Sedã",
  suv: "SUV",
  picape: "Picape",
};

export const SORT_LABEL: Record<ListingSort, string> = {
  recentes: "Mais recentes",
  "menor-preco": "Menor preço",
  "maior-desconto": "Maior desconto na FIPE",
  "menor-km": "Menor km",
};

export const REPORT_REASON_LABEL: Record<ReportReason, string> = {
  golpe: "Parece golpe",
  informacao_falsa: "Informação falsa",
  carro_vendido: "Carro já vendido",
  outro: "Outro motivo",
};

export function optionsFrom<T extends string>(labels: Record<T, string>) {
  return (Object.keys(labels) as T[]).map((value) => ({ value, label: labels[value] }));
}
