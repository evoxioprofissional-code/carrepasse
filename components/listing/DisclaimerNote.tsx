import { ShieldAlert } from "lucide-react";
import Link from "next/link";
import { DISCLAIMER } from "@/lib/site";

/** Aviso de isenção junto do botão de contato. */
export function DisclaimerNote() {
  return (
    <div className="flex gap-3 rounded-lg border border-warning/40 bg-amber-50 p-3">
      <ShieldAlert aria-hidden className="mt-0.5 size-5 shrink-0 text-warning-ink" />
      <div className="text-xs leading-relaxed text-chrome-muted">
        <p>{DISCLAIMER}</p>
        <Link href="/seguranca" className="mt-1 inline-block rounded font-semibold text-chrome underline-offset-2 hover:underline">
          Dicas para negociar com segurança
        </Link>
      </div>
    </div>
  );
}
