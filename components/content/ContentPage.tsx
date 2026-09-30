import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";

interface ContentPageProps {
  eyebrow?: string;
  title: string;
  intro: ReactNode;
  /** Ex.: "Atualizado em 30 de setembro de 2026". */
  updated?: string;
  /** Aviso no topo (ex.: texto jurídico ainda em rascunho). */
  notice?: ReactNode;
  children: ReactNode;
}

/** Moldura das páginas institucionais: faixa escura com título e texto em fundo claro. */
export function ContentPage({ eyebrow, title, intro, updated, notice, children }: ContentPageProps) {
  return (
    <div className="-mb-20 bg-paper pb-20">
      <header className="bg-night">
        <Container className="max-w-3xl py-8 sm:py-12">
          {eyebrow && <p className="text-sm font-semibold uppercase tracking-widest text-lime">{eyebrow}</p>}
          <h1 className="mt-2 text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl">{title}</h1>
          <div className="mt-3 text-base text-white/80 sm:text-lg">{intro}</div>
          {updated && <p className="mt-4 text-xs text-white/50">{updated}</p>}
        </Container>
      </header>
      <Container className="max-w-3xl py-8 sm:py-12">
        {notice && <div className="mb-8">{notice}</div>}
        <div className="content-prose">{children}</div>
      </Container>
    </div>
  );
}
