import type { SellerSummary, SellerType } from "./user";

export type PriceMode = "repasse" | "final" | "ambos";
export type ListingStatus = "ativo" | "pausado" | "vendido";
export type Fuel = "flex" | "gasolina" | "etanol" | "diesel" | "hibrido" | "eletrico";
export type Transmission = "manual" | "automatico" | "cvt" | "automatizado";
export type BodyType = "hatch" | "sedan" | "suv" | "picape";

export interface VehicleCondition {
  /** Passagem por leilão. */
  hasAuctionHistory: boolean;
  /** Sinistro / batida de monta. */
  hasAccidentHistory: boolean;
  /** Alienado. */
  isFinanced: boolean;
  /** IPVA, multas pendentes. */
  hasDebts: boolean;
  singleOwner: boolean;
  /** Revisões comprovadas. */
  hasServiceRecords: boolean;
  hasSpareKey: boolean;
}

export interface Listing {
  id: string;
  sellerId: string;
  /** Placa completa: só vem para o dono do anúncio (tabela privada). */
  plate?: string;
  /** 3 primeiras letras, públicas: exibidas como ABC**** */
  platePrefix?: string;
  brand: string;
  model: string;
  version: string;
  modelYear: number;
  manufactureYear: number;
  fuel: Fuel;
  transmission: Transmission;
  /** Usado nas imagens ilustrativas e em filtros futuros. */
  bodyType: BodyType;
  km: number;
  color: string;
  city: string;
  state: string;
  fipeCode?: string;
  fipePrice: number;
  /** Ex.: "setembro de 2026" (vem da própria API FIPE). */
  fipeReferenceMonth?: string;
  priceMode: PriceMode;
  repassePrice?: number;
  finalPrice?: number;
  /** Mínimo 80 caracteres. */
  description: string;
  condition: VehicleCondition;
  /** Mínimo 1, máximo 15. */
  photos: string[];
  status: ListingStatus;
  views: number;
  /** Preço principal antes da última redução (só o banco grava). */
  previousPrice?: number;
  /** Quando o preço caiu pela última vez (selo "Baixou" por 14 dias). */
  priceDroppedAt?: string;
  /** Toques em "Chamar no WhatsApp" (só o banco soma). */
  contacts: number;
  createdAt: string;
  updatedAt: string;
  /** Última confirmação do vendedor de que o carro está à venda (vence em 60 dias). */
  confirmedAt: string;
}

export interface ListingWithSeller extends Listing {
  seller: SellerSummary;
}

export type ListingSort = "recentes" | "menor-preco" | "maior-desconto" | "menor-km";

/** Filtros da busca. Todos opcionais; valores numéricos em reais / km. */
export interface ListingQuery {
  brand?: string;
  model?: string;
  yearMin?: number;
  yearMax?: number;
  priceMin?: number;
  priceMax?: number;
  kmMax?: number;
  state?: string;
  city?: string;
  transmission?: Transmission;
  fuel?: Fuel;
  /** "repasse" inclui anúncios "ambos"; idem "final". */
  priceMode?: Exclude<PriceMode, "ambos">;
  sellerType?: SellerType;
  bodyType?: BodyType;
  noAuction?: boolean;
  noAccident?: boolean;
  /** Qualquer câmbio que não seja manual (automático, CVT, automatizado). */
  automatic?: boolean;
  /** Preço principal pelo menos 1% abaixo da FIPE. */
  belowFipe?: boolean;
  /** Busca livre em marca/modelo/versão. */
  text?: string;
  sellerId?: string;
  /** Padrão: só "ativo". */
  status?: ListingStatus | "todos";
  sort?: ListingSort;
  offset?: number;
  limit?: number;
}

export interface ListingPage {
  items: ListingWithSeller[];
  total: number;
  hasMore: boolean;
}
