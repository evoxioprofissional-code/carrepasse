import { ClipboardCheck, MessageCircle, ScanLine, type LucideIcon } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "./SectionHeader";

const STEPS: { Icon: LucideIcon; title: string; text: string }[] = [
  {
    Icon: ScanLine,
    title: "Digite a placa",
    text: "Marca, modelo, versão, ano e valor FIPE aparecem sozinhos. Você só confere.",
  },
  {
    Icon: ClipboardCheck,
    title: "Descreva o carro",
    text: "Km, fotos e o estado real: leilão, sinistro, débitos. Quem é claro vende mais rápido.",
  },
  {
    Icon: MessageCircle,
    title: "Receba contatos no WhatsApp",
    text: "O comprador fala direto com você. Sem comissão, sem intermediário.",
  },
];

export function HowItWorks() {
  return (
    <section className="border-y border-border bg-surface/40 py-12 lg:py-16">
      <Container>
        <SectionHeader title="Anunciar leva três passos" linkHref="/como-funciona" linkLabel="Como funciona" />
        <ol className="grid gap-4 md:grid-cols-3">
          {STEPS.map(({ Icon, title, text }, index) => (
            <li key={title} className="relative flex gap-4 rounded-xl border border-border bg-surface p-6">
              <span className="font-display text-5xl font-extrabold leading-none text-border">
                {index + 1}
              </span>
              <div>
                <Icon aria-hidden className="mb-3 size-6 text-brand" />
                <h3 className="text-lg text-chrome">{title}</h3>
                <p className="mt-1 text-sm text-chrome-muted">{text}</p>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
