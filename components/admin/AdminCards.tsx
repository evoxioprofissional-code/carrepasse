import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Card de indicador horizontal: quadrado de ícone verde-claro + rótulo e valor. */
export function AdminStatCard({
  icon,
  label,
  value,
  muted,
}: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
  muted?: boolean;
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-[#DFE5EC] bg-white p-5">
      <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-lime-soft text-lime-ink [&>svg]:size-6">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-chrome-muted">{label}</p>
        <p className={cn("font-display text-3xl font-extrabold tracking-tight", muted ? "text-chrome/30" : "text-chrome")}>
          {value}
        </p>
      </div>
    </div>
  );
}
