import { TriangleAlert } from "lucide-react";

/** Marca textos jurídicos que ainda precisam de revisão profissional. */
export function DraftNotice() {
  return (
    <div role="note" className="flex gap-3 rounded-[10px] border border-warning/40 bg-warning/10 p-4 text-sm text-ink">
      <TriangleAlert aria-hidden className="mt-0.5 size-5 shrink-0 text-[#B45309]" />
      <p>
        <strong>Rascunho — revisar com advogado.</strong> Este texto-base descreve como o Car Repasse funciona hoje, mas
        ainda não passou por revisão jurídica. Dados da empresa (razão social, CNPJ e endereço) serão incluídos na versão
        final.
      </p>
    </div>
  );
}
