import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage } from "@/components/content/ContentPage";
import { DraftNotice } from "@/components/content/DraftNotice";
import { DISCLAIMER, SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Termos de uso",
  description: "Regras para usar o Car Repasse: cadastro, anúncios, responsabilidades e denúncias.",
};

export default function TermsPage() {
  return (
    <ContentPage
      eyebrow="Institucional"
      title="Termos de uso"
      intro="As regras para comprar e anunciar no Car Repasse."
      updated="Versão preliminar de 30 de setembro de 2026"
      notice={<DraftNotice />}
    >
      <h2>1. O que é o Car Repasse</h2>
      <p>
        O Car Repasse é uma plataforma de anúncios de veículos. Lojistas, corretores e particulares publicam carros à
        venda — em modalidade de repasse, preço final ou ambas — e os interessados falam diretamente com quem anunciou.
      </p>
      <p>
        <strong>{DISCLAIMER}</strong>
      </p>

      <h2>2. Cadastro</h2>
      <ul>
        <li>Para anunciar ou salvar favoritos é preciso criar uma conta com dados verdadeiros.</li>
        <li>Lojistas devem informar o nome da loja. Quem se apresenta como loja ou corretor responde por essa informação.</li>
        <li>A conta é pessoal. Você é responsável por manter sua senha em segurança.</li>
        <li>É preciso ter 18 anos ou mais.</li>
      </ul>

      <h2>3. Regras para anúncios</h2>
      <ul>
        <li>O veículo precisa existir, estar disponível e poder ser vendido por quem anuncia.</li>
        <li>
          As informações devem ser verdadeiras: quilometragem, fotos do próprio carro, preço e estado — incluindo leilão,
          sinistro, alienação e débitos.
        </li>
        <li>A descrição do estado do carro é obrigatória e deve ser honesta.</li>
        <li>Carro vendido deve ser marcado como vendido ou excluído.</li>
        <li>É proibido anunciar para aplicar golpe, pedir pagamento antecipado ou usar dados e fotos de terceiros.</li>
      </ul>

      <h2>4. Responsabilidades</h2>
      <p>
        Quem anuncia é responsável pelo conteúdo do anúncio e pela negociação. Quem compra é responsável por conferir o
        carro, a documentação e fazer a vistoria cautelar antes de pagar. O Car Repasse não garante a qualidade,
        a procedência ou a situação legal dos veículos anunciados.
      </p>

      <h2>5. Denúncias e remoção de conteúdo</h2>
      <p>
        Qualquer pessoa pode denunciar um anúncio pelo botão “Denunciar”. Podemos remover anúncios e suspender contas que
        descumpram estes termos, sem aviso prévio quando houver indício de fraude.
      </p>

      <h2>6. Preço do serviço</h2>
      <p>
        Hoje, anunciar e usar o {SITE.name} é gratuito. Se no futuro houver serviços pagos, eles serão opcionais e
        anunciados com antecedência, sem cobrança retroativa.
      </p>

      <h2>7. Seus dados</h2>
      <p>
        O tratamento de dados pessoais segue a <Link href="/privacidade">Política de Privacidade</Link>, em conformidade
        com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018).
      </p>

      <h2>8. Alterações e foro</h2>
      <p>
        Estes termos podem ser atualizados; mudanças importantes serão avisadas no site. Fica eleito o foro do domicílio
        do usuário, conforme o Código de Defesa do Consumidor.
      </p>
    </ContentPage>
  );
}
