import type { SellerType } from "./user";

/** Conta listada na gestão de usuários do painel. */
export interface AdminUser {
  id: string;
  name: string;
  phone: string | null;
  sellerType: SellerType;
  storeName: string | null;
  city: string | null;
  state: string | null;
  avatarUrl: string | null;
  createdAt: string;
  /** Quantos anúncios (não excluídos) o usuário tem. */
  listingsCount: number;
  /** Preenchido = conta banida (anúncios ocultos, não pode publicar). */
  bannedAt: string | null;
}

/** Números do site para o painel do administrador (função admin_stats do banco). */
export interface AdminStats {
  users: {
    total: number;
    newLast7Days: number;
    lojista: number;
    corretor: number;
    particular: number;
  };
  listings: {
    active: number;
    expired: number;
    paused: number;
    sold: number;
    newLast7Days: number;
    views: number;
    contacts: number;
  };
  favorites: number;
  reports: { open: number; newLast7Days: number };
  plateLookups: { last7Days: number; last30Days: number };
  /** Dados de demonstração (seed), fora das contas acima. */
  demo: { users: number; listings: number };
  generatedAt: string;
}
