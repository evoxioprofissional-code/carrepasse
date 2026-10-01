import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { AdminNav } from "./AdminNav";

interface AdminShellProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}

/** Moldura das páginas do painel: abas + cabeçalho + conteúdo, em largura cheia. */
export function AdminShell({ title, subtitle, actions, children }: AdminShellProps) {
  return (
    <Container className="max-w-6xl py-8 lg:py-10">
      <AdminNav />
      <div className="mt-6 flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-chrome sm:text-4xl">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-chrome-muted">{subtitle}</p>}
        </div>
        {actions && <div className="shrink-0">{actions}</div>}
      </div>
      <div className="mt-6">{children}</div>
    </Container>
  );
}

/** Placeholder honesto para seções que ainda vão existir (sem dado falso). */
export function AdminComingSoon({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-surface/60 p-10 text-center">
      <span className="flex size-12 items-center justify-center rounded-2xl bg-lime-soft text-lime-ink [&>svg]:size-6">
        {icon}
      </span>
      <h2 className="font-display text-xl font-bold text-chrome">{title}</h2>
      <p className="max-w-md text-sm text-chrome-muted">{children}</p>
    </div>
  );
}
