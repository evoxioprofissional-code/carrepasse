export const SITE = {
  name: "Car Repasse",
  slogan: "Preço baixo. Verdade sempre.",
  instagramHandle: "@carrepasse01",
  instagramUrl: "https://www.instagram.com/carrepasse01/",
} as const;

export const DISCLAIMER =
  "O Car Repasse é uma plataforma de anúncios e não participa das negociações. Não nos responsabilizamos por negociações, pagamentos ou acordos realizados dentro ou fora da plataforma. Nunca faça pagamentos antecipados sem ver o veículo pessoalmente e recomendamos sempre realizar uma vistoria cautelar antes da compra.";

export interface NavLink {
  href: string;
  label: string;
}

export const MAIN_NAV: NavLink[] = [
  { href: "/carros", label: "Comprar" },
  { href: "/como-funciona", label: "Como funciona" },
  { href: "/seguranca", label: "Segurança" },
];
