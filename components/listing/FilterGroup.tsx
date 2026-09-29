import type { ReactNode } from "react";

interface FilterGroupProps {
  title: string;
  children: ReactNode;
}

export function FilterGroup({ title, children }: FilterGroupProps) {
  return (
    <fieldset className="flex flex-col gap-3 border-b border-border pb-5 last:border-none last:pb-0">
      <legend className="mb-3 text-xs font-semibold uppercase tracking-widest text-chrome-muted">
        {title}
      </legend>
      {children}
    </fieldset>
  );
}
