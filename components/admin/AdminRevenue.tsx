"use client";

import {
  BarChart3,
  Calendar,
  Clock,
  CreditCard,
  DollarSign,
  Download,
  FileText,
  Search,
  UsersRound,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { AdminStatCard } from "./AdminCards";
import { AdminPageHeader } from "./AdminPageHeader";

const CHART_TICKS = ["01 out", "05 out", "10 out", "15 out", "20 out", "25 out", "31 out"];

function currentMonthLabel(): string {
  const raw = new Date().toLocaleDateString("pt-BR", { month: "long", year: "numeric", timeZone: "America/Sao_Paulo" });
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

/** Faturamento: a tela pronta, sem dados — nada é inventado (tudo "—"/vazio). */
export function AdminRevenue() {
  const [granularity, setGranularity] = useState<"diario" | "mensal">("diario");
  const month = currentMonthLabel();

  const actions = (
    <>
      <div className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#DFE5EC] bg-white px-3 text-sm font-medium text-chrome">
        <Calendar aria-hidden className="size-4 text-chrome-muted" />
        {month}
      </div>
      <button
        type="button"
        className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#DFE5EC] bg-white px-4 text-sm font-medium text-chrome transition hover:bg-surface-2"
      >
        <Download aria-hidden className="size-4" />
        Exportar
      </button>
    </>
  );

  return (
    <>
      <AdminPageHeader title="Faturamento" subtitle="Acompanhe suas receitas e pagamentos." actions={actions} />

      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <AdminStatCard icon={<DollarSign aria-hidden />} label="Receita no mês" value="—" muted />
          <AdminStatCard icon={<CreditCard aria-hidden />} label="Recebido" value="—" muted />
          <AdminStatCard icon={<Clock aria-hidden />} label="A receber" value="—" muted />
          <AdminStatCard icon={<UsersRound aria-hidden />} label="Assinaturas ativas" value="—" muted />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.7fr)_minmax(280px,1fr)]">
          <section className="rounded-xl border border-[#DFE5EC] bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-display text-base font-bold text-chrome">Evolução da receita</h2>
              <div className="inline-flex rounded-lg border border-[#DFE5EC] p-0.5">
                {(["diario", "mensal"] as const).map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setGranularity(value)}
                    className={cn(
                      "rounded-md px-3 py-1 text-sm font-medium transition",
                      granularity === value ? "bg-lime-soft text-lime-ink" : "text-chrome-muted hover:text-chrome",
                    )}
                  >
                    {value === "diario" ? "Diário" : "Mensal"}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative mt-5 h-72">
              <div className="absolute inset-0 flex flex-col justify-between">
                {Array.from({ length: 5 }, (_, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="w-4 text-right text-[10px] text-chrome-muted">—</span>
                    <span className="h-px flex-1 bg-[#EDF0F3]" />
                  </div>
                ))}
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                <BarChart3 aria-hidden className="size-7 text-chrome-muted/50" />
                <p className="text-sm text-chrome-muted">Sem movimentações no período.</p>
              </div>
              <div className="absolute inset-x-6 bottom-0 flex justify-between text-[10px] text-chrome-muted">
                {CHART_TICKS.map((tick) => (
                  <span key={tick}>{tick}</span>
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-[#DFE5EC] bg-white p-5">
            <h2 className="font-display text-base font-bold text-chrome">Resumo do período</h2>
            <dl className="mt-4 space-y-3 text-sm">
              {["Receita bruta", "Taxas", "Reembolsos"].map((label) => (
                <div key={label} className="flex items-center justify-between">
                  <dt className="text-chrome-muted">{label}</dt>
                  <dd className="font-semibold text-chrome/40">—</dd>
                </div>
              ))}
              <div className="my-1 border-t border-[#DFE5EC]" />
              <div className="flex items-center justify-between">
                <dt className="font-display text-base font-bold text-chrome">Receita líquida</dt>
                <dd className="font-display text-base font-bold text-chrome/40">—</dd>
              </div>
            </dl>
          </section>
        </div>

        <section className="rounded-xl border border-[#DFE5EC] bg-white">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#DFE5EC] p-5">
            <h2 className="font-display text-base font-bold text-chrome">Últimas transações</h2>
            <div className="flex flex-wrap items-center gap-2">
              <label className="relative">
                <Search aria-hidden className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-chrome-muted" />
                <span className="sr-only">Buscar transação</span>
                <input
                  type="search"
                  placeholder="Buscar transação..."
                  className="h-10 w-56 rounded-lg border border-[#DFE5EC] bg-surface pl-9 pr-3 text-sm text-chrome outline-none transition focus:border-lime-ink"
                />
              </label>
              <select
                aria-label="Status"
                className="h-10 rounded-lg border border-[#DFE5EC] bg-white px-3 text-sm text-chrome outline-none focus:border-lime-ink"
              >
                <option>Todos os status</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-[#DFE5EC] text-xs uppercase tracking-wide text-chrome-muted">
                  <th className="px-5 py-3 font-medium">Cliente</th>
                  <th className="px-5 py-3 font-medium">Descrição</th>
                  <th className="px-5 py-3 font-medium">Data ↓</th>
                  <th className="px-5 py-3 font-medium">Valor</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={5}>
                    <div className="flex flex-col items-center justify-center gap-2 px-6 py-14 text-center">
                      <FileText aria-hidden className="size-7 text-chrome-muted/50" />
                      <p className="text-sm text-chrome-muted">Nenhuma transação registrada.</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  );
}
