import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage } from "@/components/content/ContentPage";

export const metadata: Metadata = {
  title: "Como funciona",
  description: "O que é repasse, a diferença para o preço final e o passo a passo para comprar e vender no Car Repasse.",
};

const COMPARISON: [string, string, string][] = [
  ["Para quem", "Lojistas, corretores e quem aceita o carro como está", "Quem quer o carro pronto para usar"],
  ["Preço", "Abaixo da FIPE", "Perto da FIPE (pode ficar abaixo ou acima)"],
  ["Estado do carro", "Do jeito que está, com os pontos declarados", "Pode incluir revisão, reparos ou garantia do vendedor"],
  ["Negociação", "Direta e rápida", "Direta, com mais tempo para vistoria e test drive"],
];

const FAQ: [string, string][] = [
  ["Anunciar é pago?", "Não. Anunciar e comprar no Car Repasse é grátis."],
  [
    "O Car Repasse participa da venda?",
    "Não. A plataforma reúne os anúncios; a conversa, a vistoria e o pagamento são combinados entre comprador e vendedor.",
  ],
  [
    "Por que a FIPE aparece em todo anúncio?",
    "Para você ver na hora quanto o carro está abaixo (ou acima) da tabela, sem precisar pesquisar.",
  ],
  [
    "Posso anunciar com os dois preços?",
    "Pode. Com a opção “os dois”, o anúncio mostra o repasse para quem é do ramo e o preço final para o consumidor.",
  ],
  [
    "A placa do meu carro fica visível?",
    "Não. O anúncio mostra só as três primeiras letras (ABC****). A placa completa fica guardada e só você vê.",
  ],
];

export default function HowItWorksPage() {
  return (
    <ContentPage
      eyebrow="Como funciona"
      title="Repasse, preço final e como anunciar"
      intro="O Car Repasse junta quem vende carro abaixo da FIPE com quem procura. Tudo às claras: FIPE, estado do carro e contato direto."
    >
      <h2>O que é repasse?</h2>
      <p>
        É a venda de um carro <strong>abaixo da tabela FIPE</strong>, no estado em que ele está. É assim que lojas giram
        estoque, corretores encontram carro para revender e particulares vendem rápido. Quem compra no repasse sabe que
        pode precisar de algum reparo — por isso o estado do carro precisa estar escrito no anúncio.
      </p>

      <h2>Repasse ou preço final?</h2>
      <div className="mb-6 overflow-hidden rounded-[10px] border border-line bg-white">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">Diferenças entre repasse e preço final</caption>
          <thead className="bg-paper text-ink">
            <tr>
              <th scope="col" className="p-3 font-semibold">
                <span className="sr-only">Critério</span>
              </th>
              <th scope="col" className="p-3 font-semibold">Repasse</th>
              <th scope="col" className="p-3 font-semibold">Preço final</th>
            </tr>
          </thead>
          <tbody className="text-ink-muted">
            {COMPARISON.map(([label, repasse, final]) => (
              <tr key={label} className="border-t border-line align-top">
                <th scope="row" className="p-3 font-semibold text-ink">
                  {label}
                </th>
                <td className="p-3">{repasse}</td>
                <td className="p-3">{final}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Para comprar</h2>
      <ol>
        <li>
          <Link href="/carros">Busque</Link> por marca, preço, cidade ou use “Abaixo da FIPE”.
        </li>
        <li>Leia o anúncio inteiro: FIPE, checklist de estado (leilão, sinistro, débitos) e a descrição do vendedor.</li>
        <li>Chame o vendedor no WhatsApp direto pelo anúncio.</li>
        <li>Veja o carro pessoalmente e faça a vistoria cautelar antes de pagar.</li>
        <li>
          Feche o negócio seguindo as <Link href="/seguranca">dicas de segurança</Link>.
        </li>
      </ol>

      <h2>Para vender</h2>
      <ol>
        <li>Crie sua conta grátis como lojista, corretor ou particular.</li>
        <li>Digite a placa: marca, modelo, versão, ano e FIPE aparecem sozinhos.</li>
        <li>Conte como o carro está e marque o checklist de transparência.</li>
        <li>Envie as fotos (até 15) direto do celular.</li>
        <li>Escolha repasse, preço final ou os dois — e publique.</li>
        <li>Responda os interessados no WhatsApp. Quando vender, marque como vendido em “Meus anúncios”.</li>
      </ol>

      <h2>Perguntas frequentes</h2>
      <div className="flex flex-col gap-2">
        {FAQ.map(([question, answer]) => (
          <details key={question} className="group rounded-[10px] border border-line bg-white px-4 open:pb-4">
            <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 font-semibold text-ink">
              {question}
              <span aria-hidden className="text-lime-ink transition group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="!m-0 text-sm">{answer}</p>
          </details>
        ))}
      </div>
    </ContentPage>
  );
}
