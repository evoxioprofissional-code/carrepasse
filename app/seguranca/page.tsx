import { Ban, BadgeCheck, ClipboardCheck, FileSearch, Flag, MapPinned, type LucideIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage } from "@/components/content/ContentPage";
import { DISCLAIMER } from "@/lib/site";

export const metadata: Metadata = {
  title: "Negocie com segurança",
  description: "Como comprar e vender carro sem cair em golpe: sinal, documentação, vistoria cautelar e mais.",
};

const RULES: { Icon: LucideIcon; title: string; text: string }[] = [
  {
    Icon: Ban,
    title: "Nunca pague sinal antes de ver o carro",
    text: "Nenhum depósito para “segurar” o carro, pagar frete ou “liberar documento”. Pagamento só depois de ver o carro e o documento, com o vendedor na sua frente.",
  },
  {
    Icon: FileSearch,
    title: "Confira a documentação",
    text: "O nome no documento (CRLV) precisa ser o de quem está vendendo — ou de uma loja com CNPJ que você consiga verificar. Compare placa e chassi do documento com os do carro.",
  },
  {
    Icon: ClipboardCheck,
    title: "Faça vistoria cautelar",
    text: "Ela confere chassi, motor, sinais de batida grande, leilão, roubo e débitos. Custa bem menos que um problema escondido. Se o vendedor não aceitar, desconfie.",
  },
  {
    Icon: MapPinned,
    title: "Negocie em local público",
    text: "Veja o carro de dia, em lugar movimentado, de preferência acompanhado. Para test drive, vá junto e leve a sua habilitação.",
  },
  {
    Icon: BadgeCheck,
    title: "Desconfie de preço bom demais",
    text: "Repasse é abaixo da FIPE, mas tem limite. Carro sem leilão nem sinistro 30% ou 40% abaixo da tabela, com pressa para vender, é sinal de alerta.",
  },
  {
    Icon: Flag,
    title: "Denuncie o que parecer estranho",
    text: "Todo anúncio tem o botão Denunciar. Ele nos ajuda a tirar golpes do ar mais rápido.",
  },
];

export default function SafetyPage() {
  return (
    <ContentPage
      eyebrow="Segurança"
      title="Negocie com segurança"
      intro="Golpe de carro usado costuma seguir o mesmo roteiro. Conhecendo o roteiro, dá para evitar."
    >
      <ul className="!mb-10 !list-none !gap-3 !pl-0">
        {RULES.map(({ Icon, title, text }) => (
          <li key={title} className="flex gap-4 rounded-[10px] border border-line bg-white p-4 sm:p-5">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-lime-soft text-lime-ink">
              <Icon aria-hidden className="size-5" />
            </span>
            <div>
              <h2 className="!m-0 !text-base !font-bold">{title}</h2>
              <p className="!m-0 !mt-1 text-sm">{text}</p>
            </div>
          </li>
        ))}
      </ul>

      <h2>O golpe do falso intermediário</h2>
      <p>
        É o mais comum. O golpista copia o anúncio de um carro real, oferece por um preço baixo e, ao mesmo tempo, se
        passa por comprador para o dono verdadeiro. Os dois se encontram achando que estão negociando entre si, e o
        dinheiro vai para a conta do golpista.
      </p>
      <ul>
        <li>Faça o pagamento só para a pessoa (ou empresa) que está no documento do carro.</li>
        <li>Desconfie se pedirem para “não comentar o valor” com a outra parte.</li>
        <li>Fale direto com o dono, pelo número que aparece no anúncio.</li>
      </ul>

      <h2>Na hora de fechar</h2>
      <ol>
        <li>Faça a vistoria cautelar e leia o laudo.</li>
        <li>Consulte débitos, multas e restrições no site do Detran do estado.</li>
        <li>Se o carro for financiado, a quitação acontece no banco, com o dinheiro saindo direto para o financiamento.</li>
        <li>Preencha e reconheça a transferência (ATPV-e) antes ou junto com o pagamento.</li>
        <li>Guarde o comprovante do pagamento e a cópia de tudo que foi assinado.</li>
      </ol>

      <h2>O papel do Car Repasse</h2>
      <p>{DISCLAIMER}</p>
      <p>
        O Car Repasse <strong>nunca</strong> pede pagamento, código de confirmação ou dados bancários por WhatsApp. Se
        alguém fizer isso em nosso nome, é golpe. Dúvidas sobre como funciona? Veja{" "}
        <Link href="/como-funciona">como funciona</Link>.
      </p>
    </ContentPage>
  );
}
