"use client";

import { Megaphone, UsersRound, type LucideIcon } from "lucide-react";
import { AdminComingSoon, AdminPageHeader } from "./AdminPageHeader";

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
    <>
      <AdminPageHeader title={title} subtitle={subtitle} />
      <AdminComingSoon icon={<Icon aria-hidden />} title={heading}>
        {body}
      </AdminComingSoon>
    </>
  );
}
