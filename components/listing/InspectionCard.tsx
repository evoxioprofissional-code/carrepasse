import { ClipboardCheck } from "lucide-react";

const CHECKS = [
  "Chassi e motor batem com o documento",
  "Se já teve batida, repintura ou solda estrutural",
  "Histórico de leilão, roubo e furto",
  "Débitos e restrições no Detran",
];

export function InspectionCard() {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-5">
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-lime-soft text-lime-ink">
          <ClipboardCheck aria-hidden className="size-5" />
        </span>
        <div>
          <h3 className="text-lg text-chrome">Faça a vistoria cautelar antes de pagar</h3>
          <p className="mt-1 text-sm text-chrome-muted">
            Custa bem menos que um problema escondido. A vistoria confere, entre outras coisas:
          </p>
        </div>
      </div>
      <ul className="grid gap-1.5 text-sm text-chrome sm:grid-cols-2">
        {CHECKS.map((check) => (
          <li key={check} className="flex gap-2">
            <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-brand" />
            {check}
          </li>
        ))}
      </ul>
      <div className="rounded-lg border border-dashed border-border px-4 py-3 text-sm">
        <p className="font-semibold text-chrome">Parceiros de vistoria</p>
        <p className="text-chrome-muted">Em breve você vai poder agendar a vistoria por aqui.</p>
      </div>
    </div>
  );
}
