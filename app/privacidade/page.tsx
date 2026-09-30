import type { Metadata } from "next";
import { ContentPage } from "@/components/content/ContentPage";
import { DraftNotice } from "@/components/content/DraftNotice";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Política de privacidade",
  description: "Quais dados o Car Repasse coleta, para quê, com quem compartilha e como exercer seus direitos (LGPD).",
};

export default function PrivacyPage() {
  return (
    <ContentPage
      eyebrow="Institucional"
      title="Política de privacidade"
      intro="Como tratamos seus dados, em linguagem direta e de acordo com a LGPD (Lei nº 13.709/2018)."
      updated="Versão preliminar de 30 de setembro de 2026"
      notice={<DraftNotice />}
    >
      <h2>1. Dados que coletamos</h2>
      <h3>Quando você cria uma conta</h3>
      <ul>
        <li>Nome, e-mail, WhatsApp, cidade e estado.</li>
        <li>Tipo de conta (lojista, corretor ou particular) e, para lojistas, o nome da loja.</li>
        <li>Senha — guardada de forma criptografada; nem nós conseguimos lê-la.</li>
      </ul>
      <h3>Quando você anuncia</h3>
      <ul>
        <li>Dados do veículo, fotos, preço, descrição e o checklist de estado.</li>
        <li>A placa: guardada de forma privada. No anúncio aparecem só as três primeiras letras.</li>
      </ul>
      <h3>Enquanto você usa o site</h3>
      <ul>
        <li>Favoritos, denúncias enviadas e contagem de visualizações dos anúncios.</li>
        <li>Rascunho do anúncio e favoritos de quem não entrou na conta ficam salvos só no seu aparelho.</li>
      </ul>

      <h2>2. Para que usamos</h2>
      <ul>
        <li>Criar e manter sua conta e seus anúncios (execução do serviço).</li>
        <li>Mostrar seu nome ou loja, cidade e WhatsApp nos seus anúncios, para que compradores falem com você.</li>
        <li>Analisar denúncias e prevenir fraudes (legítimo interesse e segurança dos usuários).</li>
        <li>Cumprir obrigações legais, quando houver.</li>
      </ul>
      <p>
        <strong>Não vendemos seus dados</strong> e não usamos seus dados para publicidade de terceiros.
      </p>

      <h2>3. O que fica público</h2>
      <p>
        Nos anúncios aparecem: nome (ou nome da loja), tipo de conta, cidade/estado, WhatsApp, data de cadastro, fotos e
        dados do veículo. Seu e-mail e a placa completa <strong>não</strong> são exibidos.
      </p>

      <h2>4. Com quem compartilhamos</h2>
      <ul>
        <li>
          <strong>Supabase</strong> — banco de dados, login e armazenamento das fotos.
        </li>
        <li>
          <strong>Vercel</strong> — hospedagem do site.
        </li>
        <li>Autoridades, quando houver ordem judicial ou obrigação legal.</li>
      </ul>
      <p>Esses fornecedores tratam os dados apenas para prestar o serviço ao {SITE.name}.</p>

      <h2>5. Cookies e armazenamento local</h2>
      <p>
        Usamos cookies essenciais para manter você conectado e o armazenamento do navegador para guardar rascunhos e
        favoritos de visitantes. Não usamos cookies de publicidade.
      </p>

      <h2>6. Por quanto tempo guardamos</h2>
      <p>
        Enquanto sua conta existir. Ao excluir um anúncio, apagamos também as fotos. Ao excluir a conta, apagamos seus
        dados, salvo o que a lei obrigar a manter.
      </p>

      <h2>7. Seus direitos</h2>
      <p>Pela LGPD, você pode a qualquer momento:</p>
      <ul>
        <li>confirmar se tratamos seus dados e ter acesso a eles;</li>
        <li>corrigir dados incompletos ou desatualizados (a maioria direto em “Minha conta”);</li>
        <li>pedir a exclusão da conta e dos dados;</li>
        <li>pedir a portabilidade ou informações sobre compartilhamento;</li>
        <li>revogar consentimentos, quando for o caso.</li>
      </ul>
      <p>
        Para exercer esses direitos, fale com a gente pelo Instagram{" "}
        <a href={SITE.instagramUrl} target="_blank" rel="noopener noreferrer">
          {SITE.instagramHandle}
        </a>
        . Um canal dedicado de privacidade (encarregado de dados) será informado na versão final desta política.
      </p>

      <h2>8. Segurança</h2>
      <p>
        Os dados trafegam criptografados (HTTPS), as senhas são armazenadas com criptografia e o banco usa regras de
        acesso por usuário: cada pessoa só altera os próprios dados e anúncios.
      </p>
    </ContentPage>
  );
}
