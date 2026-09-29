import { cn } from "@/lib/cn";

export type FieldTone = "dark" | "light";

/** Aparência comum de Input, Select e Textarea. */
export function fieldStyles(hasError: boolean, className?: string, tone: FieldTone = "dark"): string {
  return cn(
    "w-full rounded-lg border px-3 text-base transition duration-150 sm:text-sm",
    "focus-visible:ring-1 focus-visible:ring-offset-0",
    "disabled:cursor-not-allowed disabled:opacity-60",
    tone === "dark" &&
      "bg-surface-2 text-chrome placeholder:text-chrome-muted/70 hover:border-chrome-muted/50 focus-visible:border-brand focus-visible:ring-brand",
    tone === "light" &&
      "bg-white text-ink placeholder:text-ink-muted hover:border-ink-muted/50 focus-visible:border-lime-ink focus-visible:ring-lime-ink disabled:bg-paper",
    hasError ? "border-danger" : tone === "dark" ? "border-border" : "border-line",
    className,
  );
}
