import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";

interface AuthCardProps {
  title: string;
  description: string;
  footer: ReactNode;
  wide?: boolean;
  children: ReactNode;
}

export function AuthCard({ title, description, footer, wide, children }: AuthCardProps) {
  return (
    <Container className="flex justify-center py-10 lg:py-16">
      <div className={wide ? "w-full max-w-2xl" : "w-full max-w-md"}>
        <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
          <h1 className="text-3xl text-chrome">{title}</h1>
          <p className="mt-1.5 text-sm text-chrome-muted">{description}</p>
          <div className="mt-6">{children}</div>
        </div>
        <div className="mt-5 text-center text-sm text-chrome-muted">{footer}</div>
      </div>
    </Container>
  );
}
