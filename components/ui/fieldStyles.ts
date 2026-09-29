import { cn } from "@/lib/cn";

/** Aparência comum de Input, Select e Textarea. */
export function fieldStyles(hasError: boolean, className?: string): string {
  return cn(
    "w-full rounded-lg border bg-surface-2 px-3 text-base text-chrome placeholder:text-chrome-muted/70 transition duration-150 sm:text-sm",
    "hover:border-chrome-muted/50 focus-visible:border-brand focus-visible:ring-1 focus-visible:ring-brand focus-visible:ring-offset-0",
    "disabled:cursor-not-allowed disabled:opacity-60",
    hasError ? "border-danger" : "border-border",
    className,
  );
}
