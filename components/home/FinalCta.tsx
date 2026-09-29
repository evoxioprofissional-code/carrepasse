import { Plus } from "lucide-react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { InstagramIcon } from "@/components/ui/InstagramIcon";
import { SITE } from "@/lib/site";

export function FinalCta() {
  return (
    <section className="pt-12 lg:pt-16">
      <Container>
        <div className="relative overflow-hidden rounded-2xl border border-brand/30 bg-surface p-8 sm:p-12">
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-24 -right-24 size-80 rounded-full bg-brand/20 blur-[100px]"
          />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-3xl text-chrome sm:text-4xl">Tem carro para repassar?</h2>
              <p className="mt-2 text-chrome-muted sm:text-lg">
                Anuncie em poucos minutos, de graça. Quem busca abaixo da FIPE está aqui todo dia.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/anunciar" size="lg">
                <Plus aria-hidden className="size-5" strokeWidth={2.5} />
                Anunciar grátis
              </ButtonLink>
              <a
                href={SITE.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-border bg-surface-2 px-6 font-semibold text-chrome transition duration-150 hover:border-brand"
              >
                <InstagramIcon className="size-5" />
                Siga {SITE.instagramHandle}
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
