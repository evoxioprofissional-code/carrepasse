import { cn } from "@/lib/cn";

interface SkeletonProps {
  className?: string;
}

/** Bloco pulsante para estados de carregamento. */
export function Skeleton({ className }: SkeletonProps) {
  return <div aria-hidden className={cn("animate-pulse rounded-lg bg-surface-2", className)} />;
}
