"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { BottomNav } from "./BottomNav";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { SkipLink } from "./SkipLink";

/**
 * Chrome do site. Nas rotas /admin o painel tem o próprio layout (sidebar),
 * então o cabeçalho público, o rodapé e a barra inferior ficam de fora.
 */
export function SiteShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) {
    return (
      <main id="conteudo" className="flex-1">
        {children}
      </main>
    );
  }

  return (
    <>
      <SkipLink />
      <Header />
      <main id="conteudo" className="flex-1 pb-20">
        {children}
      </main>
      <Footer />
      <BottomNav />
    </>
  );
}
