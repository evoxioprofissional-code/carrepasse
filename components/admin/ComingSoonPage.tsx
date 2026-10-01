"use client";

import { Megaphone, UsersRound, type LucideIcon } from "lucide-react";
import { AdminOnly } from "./AdminOnly";
import { AdminShell, AdminComingSoon } from "./AdminShell";

const ICONS: Record<string, LucideIcon> = {
  usuarios: UsersRound,
  anuncios: Megaphone,
};

interface ComingSoonPageProps {
  section: keyof typeof ICONS;
  title: string;
  subtitle: string;
  heading: string;
  body: string;
}

/** Página do painel ainda a construir — moldura real, conteúdo "em breve". */
export function ComingSoonPage({ section, title, subtitle, heading, body }: ComingSoonPageProps) {
  const Icon = ICONS[section];
  return (
    <AdminOnly>
      {() => (
        <AdminShell title={title} subtitle={subtitle}>
          <AdminComingSoon icon={<Icon aria-hidden />} title={heading}>
            {body}
          </AdminComingSoon>
        </AdminShell>
      )}
    </AdminOnly>
  );
}
