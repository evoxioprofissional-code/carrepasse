import { Building2, Check, Handshake, UserRound, type LucideIcon } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "./SectionHeader";

const AUDIENCES: { Icon: LucideIcon; title: string; lead: string; points: string[] }[] = [
  {
    Icon: Building2,
    title: "Lojista",
    lead: "Gire o estoque parado sem pagar por anúncio.",
    points: [
      "Repasse para outros lojistas e preço final para o consumidor no mesmo anúncio",
      "Cadastro pela placa: sem digitar ficha técnica",
      "Página da loja com todos os seus carros",
    ],
  },
  {
    Icon: Handshake,
    title: "Corretor",
    lead: "Ache carro abaixo da FIPE para revender com margem.",
    points: [
      "Filtre por maior desconto sobre a FIPE",
      "Veja leilão, sinistro e débitos antes de ligar",
      "Chame o vendedor direto no WhatsApp",
    ],
  },
  {
    Icon: UserRound,
    title: "Particular",
    lead: "Venda o seu carro ou compre sem cair em cilada.",
    points: [
      "Anúncio grátis, sem intermediário obrigatório",
      "Compare o preço com a FIPE em segundos",
      "Dicas de segurança em cada negociação",
    ],
  },
];

export function AudienceSection() {
  return (
    <section className="py-12 lg:py-16">
      <Container>
        <SectionHeader title="Feito para quem vive de carro" description="E para quem só quer trocar o seu." />
        <div className="grid gap-4 md:grid-cols-3">
          {AUDIENCES.map(({ Icon, title, lead, points }) => (
            <article key={title} className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-6">
              <span className="flex size-12 items-center justify-center rounded-xl bg-surface-2 text-brand">
                <Icon aria-hidden className="size-6" />
              </span>
              <div>
                <h3 className="text-xl text-chrome">{title}</h3>
                <p className="mt-1 text-sm text-chrome-muted">{lead}</p>
              </div>
              <ul className="flex flex-col gap-2.5">
                {points.map((point) => (
                  <li key={point} className="flex gap-2 text-sm text-chrome">
                    <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-brand" />
                    {point}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
