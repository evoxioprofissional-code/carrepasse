import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

interface SectionHeaderProps {
  title: string;
  description?: ReactNode;
  linkHref?: string;
  linkLabel?: string;
  /** Conteúdo extra à direita (ex.: setas do carrossel). */
  aside?: ReactNode;
}

export function SectionHeader({ title, description, linkHref, linkLabel, aside }: SectionHeaderProps) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        <h2 className="text-2xl text-chrome sm:text-3xl">{title}</h2>
        {description && <p className="mt-1 text-sm text-chrome-muted sm:text-base">{description}</p>}
      </div>
      <div className="flex shrink-0 items-center gap-3">
        {linkHref && linkLabel && (
          <Link
            href={linkHref}
            className="inline-flex items-center gap-1 rounded text-sm font-semibold text-brand transition duration-150 hover:text-brand-dark"
          >
            {linkLabel}
            <ArrowRight aria-hidden className="size-4" />
          </Link>
        )}
        {aside}
      </div>
    </div>
  );
}
