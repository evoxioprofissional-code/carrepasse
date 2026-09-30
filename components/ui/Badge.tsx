import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type BadgeVariant = "discount" | "brand" | "neutral" | "warning" | "danger";

interface BadgeProps {
  variant?: BadgeVariant;
  icon?: ReactNode;
  className?: string;
  children: ReactNode;
}

const variants: Record<BadgeVariant, string> = {
  discount: "bg-brand-gradient text-bg font-bold",
  brand: "border border-brand/40 bg-brand/10 text-brand",
  neutral: "border border-border bg-surface-2 text-chrome-muted",
  warning: "border border-warning/40 bg-warning/10 text-warning",
  danger: "border border-danger/40 bg-danger/10 text-[#F87171]",
};

export function Badge({ variant = "neutral", icon, className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 whitespace-nowrap rounded-md px-2 py-0.5 text-xs font-semibold",
        variants[variant],
        className,
      )}
    >
      {icon}
      {children}
    </span>
  );
}
