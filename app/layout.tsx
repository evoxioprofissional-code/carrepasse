import type { Metadata, Viewport } from "next";
import { Exo_2, Inter } from "next/font/google";
import { AuthProvider } from "@/components/auth/AuthProvider";
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
  // iPhone: "Adicionar à Tela de Início" abre em tela cheia, com a barra escura.
  appleWebApp: { capable: true, title: "Car Repasse", statusBarStyle: "black-translucent" },
  formatDetection: { telephone: false },
  openGraph: { siteName: "Car Repasse", locale: "pt_BR", type: "website" },
};

export const viewport: Viewport = {
  themeColor: "#0F1113",
  colorScheme: "light",
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
        <AuthProvider>
          <SkipLink />
          <Header />
          <main id="conteudo" className="flex-1 pb-20">
            {children}
          </main>
          <Footer />
          <BottomNav />
        </AuthProvider>
      </body>
    </html>
  );
}
