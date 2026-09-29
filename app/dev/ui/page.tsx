import { Car, Gavel, Heart, MessageCircle, SearchX, TriangleAlert } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Alert } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { Spinner } from "@/components/ui/Spinner";
import { Tooltip } from "@/components/ui/Tooltip";
import { DISCLAIMER } from "@/lib/site";
import { ChipsDemo } from "./_components/ChipsDemo";
import { DemoSection } from "./_components/DemoSection";
import { FormDemo } from "./_components/FormDemo";
import { ModalDemo } from "./_components/ModalDemo";
import { ServicesDemo } from "./_components/ServicesDemo";

export const metadata: Metadata = {
  title: "Componentes",
  robots: { index: false, follow: false },
};

const colors = [
  { name: "bg", hex: "#0A0A0A", className: "bg-bg" },
  { name: "surface", hex: "#141414", className: "bg-surface" },
  { name: "surface-2", hex: "#1E1E1E", className: "bg-surface-2" },
  { name: "border", hex: "#2A2A2A", className: "bg-border" },
  { name: "brand", hex: "#7ED321", className: "bg-brand" },
  { name: "brand-dark", hex: "#4CAF1A", className: "bg-brand-dark" },
  { name: "chrome", hex: "#E5E5E5", className: "bg-chrome" },
  { name: "chrome-muted", hex: "#A3A3A3", className: "bg-chrome-muted" },
  { name: "danger", hex: "#EF4444", className: "bg-danger" },
  { name: "warning", hex: "#F59E0B", className: "bg-warning" },
];

// Vitrine interna dos componentes. Não existe em produção.
export default function DevUiPage() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <Container className="flex flex-col gap-10 py-10">
      <header>
        <p className="text-sm font-semibold uppercase tracking-wide text-brand">Só em desenvolvimento</p>
        <h1 className="text-chrome-gradient mt-1 text-3xl font-extrabold sm:text-4xl">
          Componentes do Car Repasse
        </h1>
      </header>

      <DemoSection title="Cores">
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {colors.map((color) => (
            <li key={color.name} className="text-xs">
              <span className={`mb-2 block h-14 rounded-lg border border-border ${color.className}`} />
              <span className="block font-medium text-chrome">{color.name}</span>
              <span className="text-chrome-muted">{color.hex}</span>
            </li>
          ))}
        </ul>
        <div className="h-14 rounded-lg bg-brand-gradient" aria-label="Gradiente de marca" />
      </DemoSection>

      <DemoSection title="Tipografia">
        <p className="text-chrome-gradient font-display text-4xl font-extrabold tracking-tight">
          Carros abaixo da FIPE.
        </p>
        <h3 className="text-2xl text-chrome">Título de seção em Exo 2</h3>
        <p className="max-w-prose text-chrome-muted">
          Texto corrido em Inter. Motor revisado, pneus com meia vida, pequeno amassado na porta
          traseira esquerda. Documento em dia e IPVA 2026 pago.
        </p>
        <p className="font-display text-3xl font-bold text-brand">R$ 45.900</p>
      </DemoSection>

      <DemoSection title="Botões">
        <div className="flex flex-wrap items-center gap-3">
          <Button>Anunciar grátis</Button>
          <Button variant="secondary">Ver detalhes</Button>
          <Button variant="ghost">Cancelar</Button>
          <Button variant="danger">Excluir anúncio</Button>
          <Button loading>Publicando</Button>
          <Button disabled>Desabilitado</Button>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="sm">Pequeno</Button>
          <Button size="md">Médio</Button>
          <Button size="lg">
            <MessageCircle aria-hidden className="size-5" />
            Chamar no WhatsApp
          </Button>
          <ButtonLink href="/carros" variant="secondary">
            Link com cara de botão
          </ButtonLink>
        </div>
      </DemoSection>

      <DemoSection title="Badges">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="discount">-18% FIPE</Badge>
          <Badge variant="brand">Repasse</Badge>
          <Badge variant="neutral">Preço final</Badge>
          <Badge variant="neutral">Lojista</Badge>
          <Badge variant="warning" icon={<Gavel aria-hidden className="size-3" />}>
            Leilão
          </Badge>
          <Badge variant="danger" icon={<TriangleAlert aria-hidden className="size-3" />}>
            Sinistro
          </Badge>
        </div>
      </DemoSection>

      <DemoSection title="Campos de formulário">
        <FormDemo />
      </DemoSection>

      <DemoSection title="Filtros ativos">
        <ChipsDemo />
      </DemoSection>

      <DemoSection title="Modal e drawer">
        <ModalDemo />
      </DemoSection>

      <DemoSection title="Serviços: placa (mock) + FIPE (real)">
        <ServicesDemo />
      </DemoSection>

      <DemoSection title="Tooltip">
        <p className="flex items-center gap-2 text-sm text-chrome">
          Preço de repasse
          <Tooltip label="O que é preço de repasse?" align="start">
            Valor abaixo da FIPE, pensado para quem compra para revender ou quer pagar menos e
            aceita o carro no estado em que está.
          </Tooltip>
        </p>
      </DemoSection>

      <DemoSection title="Alertas">
        <div className="grid gap-3 md:grid-cols-2">
          <Alert variant="warning" title="Aviso de isenção">
            {DISCLAIMER}
          </Alert>
          <Alert variant="success" title="Seu preço está 15% abaixo da FIPE">
            Ótimo para repasse!
          </Alert>
          <Alert variant="info">Recomendamos fazer a vistoria cautelar antes de fechar negócio.</Alert>
          <Alert variant="danger" title="Não foi possível consultar a FIPE">
            Tente de novo em alguns segundos.
          </Alert>
        </div>
      </DemoSection>

      <DemoSection title="Cards e carregamento">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card interactive className="p-4">
            <p className="font-display font-bold text-chrome">Card interativo</p>
            <p className="text-sm text-chrome-muted">Passe o mouse para ver a borda verde.</p>
          </Card>
          <Card className="flex flex-col gap-3 p-4" aria-busy>
            <Skeleton className="aspect-[4/3] w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-7 w-1/3" />
          </Card>
          <Card className="flex items-center justify-center gap-2 p-4 text-sm text-chrome-muted">
            <Spinner className="text-brand" label="Consultando a placa" />
            Consultando a placa...
          </Card>
        </div>
      </DemoSection>

      <DemoSection title="Estados vazios">
        <div className="grid gap-4 md:grid-cols-2">
          <EmptyState
            icon={<SearchX aria-hidden />}
            title="Nenhum carro com esses filtros"
            description="Tente aumentar o preço máximo ou tirar o filtro de cidade."
            action={<Button variant="secondary">Limpar filtros</Button>}
          />
          <EmptyState
            icon={<Heart aria-hidden />}
            title="Você ainda não favoritou nenhum carro"
            description="Toque no coração dos anúncios para acompanhar aqui."
            action={
              <ButtonLink href="/carros">
                <Car aria-hidden className="size-4" />
                Ver carros
              </ButtonLink>
            }
          />
        </div>
      </DemoSection>
    </Container>
  );
}
