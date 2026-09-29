import type { Metadata, Viewport } from "next";
import { Exo_2, Inter } from "next/font/google";
import { BottomNav } from "@/components/layout/BottomNav";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SkipLink } from "@/components/layout/SkipLink";
import { siteUrl } from "@/lib/site-url";
import "./globals.css";

// Fontes variáveis (sem lista de pesos): cobrem 400–600 e 700–800 e evitam
// um erro do Turbopack no Next 16 com múltiplos pesos.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const exo2 = Exo_2({
  subsets: ["latin"],
  variable: "--font-exo2",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: siteUrl(),
  title: {
    default: "Car Repasse — Preço baixo. Verdade sempre.",
    template: "%s | Car Repasse",
  },
  description:
    "Carros de repasse abaixo da FIPE, com o estado real de cada veículo. Anuncie grátis.",
  applicationName: "Car Repasse",
};

export const viewport: Viewport = {
  themeColor: "#0A0A0A",
  colorScheme: "dark",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${exo2.variable}`}>
      <body className="flex min-h-dvh flex-col pb-[calc(4rem+env(safe-area-inset-bottom))] md:pb-0">
        <SkipLink />
        <Header />
        <main id="conteudo" className="flex-1 pb-20">
          {children}
        </main>
        <Footer />
        <BottomNav />
      </body>
    </html>
  );
}
