import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 rounded-xl border border-dashed border-border px-6 py-12 text-center",
        className,
      )}
    >
      <span className="flex size-12 items-center justify-center rounded-full bg-surface-2 text-chrome-muted [&>svg]:size-6">
        {icon}
      </span>
      <h3 className="text-lg text-chrome">{title}</h3>
      {description && <p className="max-w-sm text-sm text-chrome-muted">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
