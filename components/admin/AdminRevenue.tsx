"use client";

import { Lock, Wallet } from "lucide-react";
import { Alert } from "@/components/ui/Alert";
import { Card } from "@/components/ui/Card";
import { AdminOnly } from "./AdminOnly";
import { AdminShell } from "./AdminShell";

const GHOST_CARDS = ["Receita no mês", "Recebido", "A receber", "Assinaturas ativas"];

/** Faturamento: desenhado e pronto, mas sem dado — nada é inventado. */
export function AdminRevenue() {
  return (
    <AdminOnly>
      {() => (
        <AdminShell
          title="Faturamento"
          subtitle="A receita do site aparece aqui quando houver pagamento conectado."
        >
          <Alert variant="warning">
            Nenhuma forma de pagamento está conectada, e anunciar é grátis hoje. Quando você definir a monetização
            (destaque pago, plano para lojista, cobrança por anúncio…), os números passam a aparecer aqui — sem
            precisar mexer nesta tela de novo.
          </Alert>

          <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {GHOST_CARDS.map((label) => (
              <Card key={label} className="p-4">
                <p className="flex items-center gap-2 text-sm font-medium text-chrome-muted">
                  <Wallet aria-hidden className="size-4" />
                  {label}
                </p>
                <p className="mt-2 font-display text-3xl font-extrabold tracking-tight text-chrome/25">—</p>
                <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-surface-2 px-2 py-0.5 text-xs text-chrome-muted">
                  <Lock aria-hidden className="size-3" />
                  em breve
                </span>
              </Card>
            ))}
          </div>

          <div className="mt-3 flex h-56 items-center justify-center rounded-2xl border border-dashed border-border bg-surface/60 px-6 text-center text-sm text-chrome-muted">
            O gráfico de faturamento aparece aqui assim que os pagamentos estiverem ligados.
          </div>
        </AdminShell>
      )}
    </AdminOnly>
  );
}
