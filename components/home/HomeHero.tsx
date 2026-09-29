import { existsSync } from "node:fs";
import { join } from "node:path";
import Image from "next/image";
import { Container } from "@/components/ui/Container";

// Foto de fundo do hero (Wikimedia Commons, créditos em /creditos).
// Sem o arquivo, o hero fica no fundo escuro liso — nada de carro desenhado.
const HERO_PHOTO = "/demo/hero.jpg";

export function HomeHero() {
  const hasHeroPhoto = existsSync(join(process.cwd(), "public", HERO_PHOTO));

  return (
    <section className="relative isolate overflow-hidden bg-night">
      {hasHeroPhoto && (
        <div aria-hidden className="absolute inset-y-0 right-0 -z-20 w-full sm:w-[70%] lg:w-[52%]">
          <Image
            src={HERO_PHOTO}
            alt=""
            fill
            priority
            sizes="(min-width: 1024px) 52vw, (min-width: 640px) 70vw, 100vw"
            className="object-cover object-[60%_42%]"
          />
        </div>
      )}
      {/* Camada escura: sólida à esquerda (texto) e abrindo para a foto à direita */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,#0F1113_0%,#0F1113_40%,rgba(15,17,19,0.78)_58%,rgba(15,17,19,0.35)_80%,rgba(15,17,19,0.15)_100%)] max-sm:bg-[linear-gradient(90deg,rgba(15,17,19,0.9)_0%,rgba(15,17,19,0.62)_100%)]"
      />
      <Container className="pb-[76px] pt-6 sm:pb-[88px] sm:pt-9 lg:pb-[78px] lg:pt-7">
        <h1 className="max-w-3xl text-[28px] font-extrabold leading-[1.1] tracking-tight text-white min-[375px]:text-[32px] sm:text-5xl lg:text-[52px] lg:leading-[1.02]">
          Seu próximo carro.
          <br />
          Um negócio mais justo.
        </h1>
        <p className="mt-3 max-w-3xl text-[15px] leading-snug text-white/85 sm:text-lg lg:text-xl">
          Compare preços, confira os detalhes e negocie direto com o vendedor.
        </p>
      </Container>
    </section>
  );
}
