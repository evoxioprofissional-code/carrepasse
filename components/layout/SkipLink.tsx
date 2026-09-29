import Link from "next/link";

/** Primeiro item focável: pula direto para o conteúdo (teclado). */
export function SkipLink() {
  return (
    <Link
      href="#conteudo"
      className="sr-only z-50 rounded-lg bg-brand px-4 py-2 font-semibold text-bg focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
    >
      Pular para o conteúdo
    </Link>
  );
}
