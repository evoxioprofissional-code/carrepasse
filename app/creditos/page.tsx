import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PHOTO_CREDITS } from "@/mocks/photoCredits";

export const metadata: Metadata = {
  title: "Créditos das imagens",
  description: "Autoria e licença das fotos usadas nos anúncios de demonstração do Car Repasse.",
};

export default function CreditsPage() {
  return (
    <Container className="max-w-4xl py-10 lg:py-14">
      <h1 className="text-3xl text-chrome sm:text-4xl">Créditos das imagens</h1>
      <p className="mt-3 text-chrome-muted">
        Os anúncios de demonstração usam fotos do Wikimedia Commons, marcadas como &ldquo;Imagem
        ilustrativa&rdquo;. As fotos foram redimensionadas e recomprimidas; a do topo da página inicial
        também foi escurecida. Fotos enviadas pelos vendedores são de responsabilidade de quem anuncia.
      </p>
      <ul className="mt-8 divide-y divide-border rounded-xl border border-border bg-surface">
        {PHOTO_CREDITS.map((credit) => (
          <li key={credit.file} className="flex flex-col gap-1 p-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
            <span className="font-semibold text-chrome">{credit.subject}</span>
            <span className="text-sm text-chrome-muted">
              Foto de {credit.author} ·{" "}
              {credit.licenseUrl ? (
                <a href={credit.licenseUrl} target="_blank" rel="noopener noreferrer" className="underline-offset-2 hover:text-brand hover:underline">
                  {credit.license}
                </a>
              ) : (
                credit.license
              )}{" "}
              ·{" "}
              <a href={credit.source} target="_blank" rel="noopener noreferrer" className="underline-offset-2 hover:text-brand hover:underline">
                original
              </a>
            </span>
          </li>
        ))}
      </ul>
    </Container>
  );
}
