import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface WizardActionsProps {
  onBack?: () => void;
  onNext: () => void;
  nextLabel: string;
  loading?: boolean;
  disabled?: boolean;
  hint?: string;
}

/** Barra de Voltar/Continuar: fixa no rodapé do celular, no fluxo no desktop. */
export function WizardActions({ onBack, onNext, nextLabel, loading, disabled, hint }: WizardActionsProps) {
  return (
    <>
      {/* Espaço para a barra fixa não cobrir o fim do conteúdo no celular */}
      <div aria-hidden className="h-24 sm:hidden" />
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-surface/95 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur-md sm:static sm:mt-8 sm:border-0 sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
        {hint && <p className="mb-2 text-center text-xs text-chrome-muted sm:text-right">{hint}</p>}
        <div className="flex gap-3 sm:justify-end">
          {onBack && (
            <Button variant="secondary" size="lg" onClick={onBack} className="shrink-0 px-4">
              <ArrowLeft aria-hidden className="size-5" />
              <span className="max-[359px]:sr-only">Voltar</span>
            </Button>
          )}
          <Button size="lg" onClick={onNext} loading={loading} disabled={disabled} className="flex-1 sm:flex-none sm:px-8">
            {nextLabel}
            {!loading && <ArrowRight aria-hidden className="size-5" />}
          </Button>
        </div>
      </div>
    </>
  );
}
