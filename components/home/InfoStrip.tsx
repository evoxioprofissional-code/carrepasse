import { FileText, Handshake, ReceiptText, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

const ITEMS: { Icon: LucideIcon; title: string; text: string }[] = [
  {
    Icon: ReceiptText,
    title: "FIPE à vista",
    text: "Veja o valor da FIPE de cada anúncio e compare com o preço do vendedor.",
  },
  {
    Icon: FileText,
    title: "Detalhes antes do contato",
    text: "Informações essenciais do carro para você negociar com mais segurança.",
  },
  {
    Icon: Handshake,
    title: "Negociação direta",
    text: "Fale diretamente com o vendedor e combine do seu jeito.",
  },
];

export function InfoStrip({ className }: { className?: string }) {
  return (
    <section aria-label="Como o Car Repasse ajuda" className={cn("py-4 sm:py-6", className)}>
      <ul className="grid gap-6 md:grid-cols-3 md:gap-0">
        {ITEMS.map(({ Icon, title, text }, index) => (
          <li
            key={title}
            className={cn(
              "flex items-start gap-5 md:justify-center md:px-6",
              index > 0 && "md:border-l md:border-line",
            )}
          >
            <Icon aria-hidden className="size-11 shrink-0 text-lime-ink" strokeWidth={1.5} />
            <div className="max-w-[280px]">
              <h2 className="text-[15px] font-bold text-ink">{title}</h2>
              <p className="mt-1 text-sm leading-snug text-ink-muted">{text}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
