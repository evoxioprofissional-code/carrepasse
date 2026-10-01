import type { Metadata } from "next";
import { ComingSoonPage } from "@/components/admin/ComingSoonPage";

export const metadata: Metadata = { title: "Anúncios", robots: { index: false } };

export default function ListingsAdminPage() {
  return (
    <ComingSoonPage
      section="anuncios"
      title="Anúncios"
      subtitle="Todos os anúncios do site, para moderar."
      heading="Moderação de anúncios chega aqui"
      body="Em breve você vai ver todos os anúncios, pausar, remover e tratar os que foram denunciados, sem precisar sair do painel."
    />
  );
}
