export type SellerType = "lojista" | "corretor" | "particular";

export interface User {
  id: string;
  name: string;
  email: string;
  /** WhatsApp, só dígitos com DDD. */
  phone: string;
  sellerType: SellerType;
  /** Obrigatório para lojista. */
  storeName?: string;
  city: string;
  /** UF */
  state: string;
  avatarUrl?: string;
  /** ISO */
  createdAt: string;
}

/** Dados do vendedor que aparecem junto do anúncio. */
export type SellerSummary = Pick<
  User,
  "id" | "name" | "storeName" | "sellerType" | "city" | "state" | "phone" | "avatarUrl" | "createdAt"
>;
