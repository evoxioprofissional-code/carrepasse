import type { Metadata } from "next";
import { ComingSoonPage } from "@/components/admin/ComingSoonPage";

export const metadata: Metadata = { title: "Usuários", robots: { index: false } };

export default function UsersPage() {
  return (
    <ComingSoonPage
      section="usuarios"
      title="Usuários"
      subtitle="Lojistas, corretores e particulares do site."
      heading="Gestão de usuários chega aqui"
      body="Em breve você vai listar, buscar, ver o histórico de cada conta e banir ou desbanir lojistas e usuários direto por esta tela."
    />
  );
}
