import { CircleCheck, CircleMinus, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/cn";
import type { VehicleCondition } from "@/types/listing";

interface ConditionChecklistProps {
  condition: VehicleCondition;
}

type Tone = "good" | "warn" | "neutral";

interface ConditionItem {
  tone: Tone;
  label: string;
  detail?: string;
}

function describe(condition: VehicleCondition): ConditionItem[] {
  return [
    condition.hasAuctionHistory
      ? { tone: "warn", label: "Tem passagem por leilão", detail: "Pode dificultar seguro e financiamento." }
      : { tone: "good", label: "Sem passagem por leilão" },
    condition.hasAccidentHistory
      ? { tone: "warn", label: "Tem histórico de sinistro", detail: "Batida de monta ou indenização de seguradora." }
      : { tone: "good", label: "Sem sinistro informado" },
    condition.isFinanced
      ? { tone: "warn", label: "Alienado (financiado)", detail: "A quitação precisa acontecer na venda." }
      : { tone: "good", label: "Quitado, sem alienação" },
    condition.hasDebts
      ? { tone: "warn", label: "Tem débitos pendentes", detail: "IPVA, licenciamento ou multas em aberto." }
      : { tone: "good", label: "Sem débitos informados" },
    condition.singleOwner
      ? { tone: "good", label: "Único dono" }
      : { tone: "neutral", label: "Mais de um dono" },
    condition.hasServiceRecords
      ? { tone: "good", label: "Revisões comprovadas" }
      : { tone: "warn", label: "Sem comprovação de revisões" },
    condition.hasSpareKey
      ? { tone: "good", label: "Tem chave reserva" }
      : { tone: "warn", label: "Sem chave reserva" },
  ];
}

const ICONS = {
  good: { Icon: CircleCheck, className: "text-lime-ink" },
  warn: { Icon: TriangleAlert, className: "text-warning-ink" },
  neutral: { Icon: CircleMinus, className: "text-chrome-muted" },
} as const;

/** Transparência: o que o vendedor declarou sobre o carro. */
export function ConditionChecklist({ condition }: ConditionChecklistProps) {
  const items = describe(condition);
  const warnings = items.filter((item) => item.tone === "warn").length;

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-chrome-muted">
        {warnings === 0
          ? "O vendedor não declarou nenhum ponto de atenção."
          : `O vendedor declarou ${warnings} ${warnings === 1 ? "ponto de atenção" : "pontos de atenção"}. Leia antes de negociar.`}
      </p>
      <ul className="grid gap-2 sm:grid-cols-2">
        {items.map((item) => {
          const { Icon, className } = ICONS[item.tone];
          return (
            <li
              key={item.label}
              className={cn(
                "flex gap-3 rounded-lg border p-3",
                item.tone === "warn" ? "border-warning/40 bg-warning/5" : "border-border bg-surface",
              )}
            >
              <Icon aria-hidden className={cn("mt-0.5 size-5 shrink-0", className)} />
              <span className="flex flex-col">
                <span className="text-sm font-semibold text-chrome">{item.label}</span>
                {item.detail && <span className="text-xs text-chrome-muted">{item.detail}</span>}
              </span>
            </li>
          );
        })}
      </ul>
      <p className="text-xs text-chrome-muted">
        Informações declaradas pelo vendedor. Confirme tudo numa vistoria cautelar.
      </p>
    </div>
  );
}
