import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/cn";

interface SpinnerProps {
  className?: string;
  /** Texto lido por leitores de tela. */
  label?: string;
}

export function Spinner({ className, label = "Carregando" }: SpinnerProps) {
  return (
    <span role="status" className="inline-flex">
      <LoaderCircle aria-hidden className={cn("size-4 animate-spin", className)} />
      <span className="sr-only">{label}</span>
    </span>
  );
}
