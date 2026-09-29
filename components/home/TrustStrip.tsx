import { ClipboardCheck, Scale, Tag, type LucideIcon } from "lucide-react";
import { Container } from "@/components/ui/Container";

const ITEMS: { Icon: LucideIcon; title: string; text: string }[] = [
  {
    Icon: Scale,
    title: "FIPE em todo anúncio",
    text: "Você vê na hora quanto o carro está abaixo (ou acima) da tabela.",
  },
  {
    Icon: ClipboardCheck,
    title: "Estado real do carro",
    text: "Leilão, sinistro, alienação e débitos informados antes do primeiro contato.",
  },
  {
    Icon: Tag,
    title: "Anuncie grátis",
    text: "Sem plano, sem taxa por venda. Digita a placa e o anúncio sai em minutos.",
  },
];

export function TrustStrip() {
  return (
    <section aria-label="Por que o Car Repasse" className="border-b border-border bg-surface/40">
      <Container className="grid gap-6 py-8 md:grid-cols-3">
        {ITEMS.map(({ Icon, title, text }) => (
          <div key={title} className="flex gap-4">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-brand/30 bg-brand/10 text-brand">
              <Icon aria-hidden className="size-5" />
            </span>
            <div>
              <h2 className="font-display text-base font-bold text-chrome">{title}</h2>
              <p className="mt-0.5 text-sm text-chrome-muted">{text}</p>
            </div>
          </div>
        ))}
      </Container>
    </section>
  );
}
