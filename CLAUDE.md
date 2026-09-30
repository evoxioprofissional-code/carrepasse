# Car Repasse — Contexto do Projeto

Este arquivo é lido automaticamente pelo Claude Code em toda sessão. Ele define **o que é o projeto, como ele deve parecer e como o código deve ser escrito**. A especificação funcional completa está em `SPEC.md`.

---

## 1. O produto

**Car Repasse** é um marketplace brasileiro de compra e venda de veículos, focado em carros na **modalidade repasse** (abaixo da tabela FIPE), mas que também aceita anúncios com **preço final** para o consumidor.

- **Slogan:** "Preço baixo. Verdade sempre."
- **Problema que resolve:** lojistas, corretores e particulares reclamam da OLX — muito anúncio genérico, pouca transparência, golpes frequentes e nenhuma ferramenta pensada para quem trabalha com repasse.
- **Públicos (todos compram E vendem):**
  - **Lojista** — revenda com estoque, quer girar carro rápido.
  - **Corretor** — intermediário, compra no repasse e revende.
  - **Particular** — pessoa física vendendo ou comprando o próprio carro.
- **Diferenciais:**
  1. Cadastro inteligente: digita a placa e o sistema preenche marca, modelo, versão, ano e FIPE.
  2. FIPE e % de desconto sempre visíveis em todo anúncio.
  3. Descrição honesta do estado do veículo é obrigatória.
  4. Duas modalidades de preço no mesmo anúncio: repasse e preço final.
  5. Postura ativa contra golpes: aviso de isenção, dicas de segurança, botão de denúncia, incentivo à vistoria cautelar.
- **Modelo de negócio atual:** anunciar é **100% gratuito** para todos. Não criar telas de planos, pagamentos ou anúncios pagos. Apenas deixar a arquitetura sem impedimentos para isso no futuro.
- **Canal de aquisição:** Instagram @carrepasse01. A maior parte dos acessos virá do celular, por links compartilhados no Instagram e WhatsApp.

---

## 2. Stack e restrições

- **Next.js 16 (App Router)**, **TypeScript em modo strict**, **Tailwind CSS 3.4** (tokens em `tailwind.config.ts`).
- **Backend: Supabase** (projeto `carrepasse`, região `sa-east-1`): Postgres com RLS, Auth (e-mail e senha) e Storage (fotos). Esquema versionado em `supabase/migrations/` (ver `supabase/README.md`). Nenhum componente acessa a Supabase ou o `localStorage` diretamente — só os repositórios (seção 5).
- APIs externas: **FIPE pública da Parallelum** (v1 para marca/modelo/ano, v2 por código FIPE), com plano B no catálogo local; **IBGE Localidades** (cidades por UF).
- A consulta por **placa ainda é mockada** (`services/plateLookup.ts`). A troca prevista é pelo **API Placas** (wdapi2), chamado só pelo servidor com o token em variável de ambiente. Envio de e-mail (recuperação de senha) previsto com **Resend**.
- Bibliotecas aprovadas: `lucide-react` (ícones), `react-hook-form` + `zod` + `@hookform/resolvers` (formulários), `clsx` + `tailwind-merge@2` (classes), `embla-carousel-react` (galeria), `@supabase/supabase-js` + `@supabase/ssr` (dados e sessão). Pedir confirmação antes de adicionar qualquer outra dependência.
- Não usar bibliotecas de componentes prontas (shadcn, MUI, Chakra). Os componentes base são próprios, em `components/ui`.
- Gerenciador de pacotes: **npm**.

---

## 3. Design system

### Direção visual
Esportiva, premium e confiável. Header e topo das páginas escuros; a vitrine (home) e as páginas de conteúdo usam área clara para os anúncios e textos (tokens `night`, `paper`, `ink`, `line`, `lime` no `tailwind.config.ts`). Todas as telas seguem esse visual claro; só header, hero da home e rodapé são escuros. Inspiração na logo: escudo verde-limão, letras cromadas, silhueta de carro esportivo sobre fundo preto. Evitar visual de "classificado barato" — o site precisa transmitir que é sério e seguro.

### Cores (definir como tokens no `tailwind.config.ts`)
| Token | Valor | Uso |
|---|---|---|
| `bg` | `#F4F5F7` | Fundo da página |
| `surface` | `#FFFFFF` | Cards, modais, menus |
| `surface-2` | `#F1F3F5` | Blocos internos, hovers |
| `border` | `#E1E4E8` | Bordas e divisores |
| `brand` / `lime` | `#7ED321` | Fundo de CTAs, selos e destaques (nunca como cor de texto no fundo claro) |
| `lime-ink` | `#2F6B0C` | Texto/ícone verde sobre fundo claro (links, ativos) |
| `chrome` / `ink` | `#15171A` | Títulos e texto principal |
| `chrome-muted` / `ink-muted` | `#5E6570` | Texto secundário |
| `danger` / `danger-ink` | `#EF4444` / `#B91C1C` | Erros, denúncia (use `-ink` para texto) |
| `warning` / `warning-ink` | `#F59E0B` / `#92400E` | Avisos: leilão, sinistro (use `-ink` para texto) |
| `night` | `#0F1113` | Header e hero escuros |

- Botão primário e selo de desconto: fundo `lime` com texto `ink`.
- Efeito "cromado" opcional em títulos grandes: gradiente de `#FFFFFF` a `#9CA3AF` com `background-clip: text`.
- Contraste mínimo WCAG AA em todo texto.

### Tipografia (via `next/font/google`)
- **Títulos:** `Exo 2`, pesos 700–800, levemente condensada e esportiva, com `tracking-tight`.
- **Texto e UI:** `Inter`, pesos 400–600.
- **Preços:** `Exo 2` 700, sempre na cor `brand`.

### Forma e movimento
- Bordas arredondadas: `rounded-xl` em cards, `rounded-lg` em inputs e botões.
- Sombras discretas; realce com borda `brand` em hover/foco em vez de sombra pesada.
- Transições curtas (150–200ms). Respeitar `prefers-reduced-motion`.
- Estados de foco sempre visíveis (anel verde).

### Logo
- A logo original está em `logo/` na raiz do projeto. Copiar para `public/brand/` e usar via `next/image`.
- A imagem atual tem fundo preto; ela funciona sobre o fundo `bg`. Não aplicar sobre fundos claros.
- Gerar a partir dela: favicon, ícones do PWA (192 e 512) e imagem padrão de Open Graph (1200×630).

---

## 4. Convenções de código

- **Idioma:** toda a interface em **português do Brasil**. Nomes de variáveis, funções, tipos e arquivos em **inglês**. Comentários em português quando forem necessários.
- **Server Components por padrão**; `"use client"` só onde houver estado, eventos ou `localStorage`.
- Componentes pequenos e focados. Um componente por arquivo, nome em PascalCase.
- Tipos centralizados em `types/`. Nada de `any`.
- Formatação sempre pelos helpers de `lib/format.ts`: moeda em BRL (`R$ 45.900`), quilometragem (`87.500 km`), datas relativas ("há 2 dias").
- Placas: aceitar formato antigo (`ABC-1234`) e Mercosul (`ABC1D23`), normalizando para maiúsculas sem hífen.
- Acessibilidade: `alt` em toda imagem, `label` em todo input, navegação completa por teclado, HTML semântico.
- **O site é usado principalmente no celular.** Toda tela é pensada primeiro para o celular e testada em 320, 360, 375, 390, 412 e 430px antes do desktop:
  - nenhuma rolagem horizontal;
  - alvos de toque com pelo menos 44px (mínimo aceitável 40px);
  - campos com fonte de 16px no celular (abaixo disso o iPhone dá zoom sozinho);
  - barras fixas (navegação inferior, contato) nunca cobrindo conteúdo e respeitando a área segura (`env(safe-area-inset-*)`).
- Todo estado assíncrono tem loading (skeleton), vazio e erro tratados.

---

## 5. Arquitetura

```
app/                 # Rotas (App Router)
components/
  ui/                # Botão, Input, Select, Badge, Modal, Skeleton...
  listing/           # Cards, galeria, bloco de preço, ficha técnica...
  layout/            # Header, Footer, BottomNav mobile
  forms/             # Wizard de anúncio e seus passos
lib/                 # format.ts, plate.ts, fipe-math.ts, cn.ts
services/            # Integrações: fipeApi.ts, plateLookup.ts (mock)
repositories/        # Persistência: listingRepository.ts, userRepository.ts...
mocks/               # Dados iniciais (seed)
types/               # Interfaces de domínio
hooks/               # useAuth, useFavorites, useListings...
public/brand/        # Logo, ícones, OG
```

- **Repositórios** expõem funções assíncronas (`list`, `getById`, `create`, `update`, `remove`) sobre a Supabase. `localStorage` fica só para preferências do aparelho (favoritos de visitante, rascunho do anúncio), sempre via `repositories/storage.ts`.
- **`mocks/`** é a fonte do seed de demonstração (`supabase/seed.sql`), do catálogo FIPE de plano B e do mock de placa.
- **Serviços** (`services/`) falam com APIs externas; os mocks simulam latência realista (300–900ms).

---

## 6. Git e fluxo de trabalho

- Repositório: `https://github.com/evoxioprofissional-code/carrepasse.git`, branch principal `main`.
- Commits pequenos e frequentes, no padrão **Conventional Commits** em português: `feat: cadastro de anúncio por placa`, `fix: formatação de km`, `chore: configura tailwind`.
- Fazer commit ao final de cada fase do `SPEC.md` e dar push.
- Antes de cada commit: `npm run lint` e `npm run build` precisam passar sem erros.
- Nunca commitar `.env`, chaves ou `node_modules`.
- Ao terminar uma fase, resumir o que foi feito e o que falta antes de seguir para a próxima.
