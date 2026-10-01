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
