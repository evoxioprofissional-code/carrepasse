import { CircleCheck, Info, ShieldAlert, TriangleAlert, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type AlertVariant = "info" | "success" | "warning" | "danger";

interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  className?: string;
  children: ReactNode;
}

const styles: Record<AlertVariant, { box: string; icon: string; Icon: LucideIcon }> = {
  info: { box: "border-border bg-surface-2", icon: "text-chrome-muted", Icon: Info },
  success: { box: "border-lime/50 bg-lime-soft", icon: "text-lime-ink", Icon: CircleCheck },
  warning: { box: "border-warning/40 bg-amber-50", icon: "text-warning-ink", Icon: TriangleAlert },
  danger: { box: "border-danger/30 bg-red-50", icon: "text-danger-ink", Icon: ShieldAlert },
};

export function Alert({ variant = "info", title, className, children }: AlertProps) {
  const { box, icon, Icon } = styles[variant];

  return (
    <div
      role={variant === "danger" ? "alert" : "note"}
      className={cn("flex gap-3 rounded-xl border p-4", box, className)}
    >
      <Icon aria-hidden className={cn("mt-0.5 size-5 shrink-0", icon)} />
      <div className="flex flex-col gap-1 text-sm">
        {title && <p className="font-semibold text-chrome">{title}</p>}
        <div className="leading-relaxed text-chrome-muted">{children}</div>
      </div>
    </div>
  );
}
