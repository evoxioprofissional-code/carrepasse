import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

type CardProps = ComponentProps<"div"> & {
  /** Realça a borda no hover (cards clicáveis). */
  interactive?: boolean;
};

export function Card({ interactive = false, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-surface",
        interactive && "transition duration-150 hover:border-brand/60",
        className,
      )}
      {...props}
    />
  );
}
