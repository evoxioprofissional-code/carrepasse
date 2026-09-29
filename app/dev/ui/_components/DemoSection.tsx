import type { ReactNode } from "react";

interface DemoSectionProps {
  title: string;
  children: ReactNode;
}

export function DemoSection({ title, children }: DemoSectionProps) {
  return (
    <section className="flex flex-col gap-4 border-t border-border pt-8">
      <h2 className="text-xl text-chrome">{title}</h2>
      {children}
    </section>
  );
}
