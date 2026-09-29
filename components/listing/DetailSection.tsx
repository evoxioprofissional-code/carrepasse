import type { ReactNode } from "react";

interface DetailSectionProps {
  title: string;
  children: ReactNode;
}

export function DetailSection({ title, children }: DetailSectionProps) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-xl text-chrome sm:text-2xl">{title}</h2>
      {children}
    </section>
  );
}

