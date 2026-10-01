import type { ReactNode } from "react";

interface AdminPageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

/** Cabeçalho do conteúdo de cada página do painel (título + ações). */
export function AdminPageHeader({ title, subtitle, actions }: AdminPageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-chrome sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-chrome-muted">{subtitle}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

/** Placeholder honesto para seções ainda a construir (sem dado falso). */
export function AdminComingSoon({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-[#DFE5EC] bg-white p-10 text-center">
      <span className="flex size-12 items-center justify-center rounded-2xl bg-lime-soft text-lime-ink [&>svg]:size-6">
        {icon}
      </span>
      <h2 className="font-display text-xl font-bold text-chrome">{title}</h2>
      <p className="max-w-md text-sm text-chrome-muted">{children}</p>
    </div>
  );
}
