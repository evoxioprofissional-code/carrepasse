# Car Repasse — Especificação do MVP (Front-end)

Leia o `CLAUDE.md` antes deste arquivo. Aqui está **o que construir**; lá está **como construir**.

---

## 1. Modelos de dados (`types/`)

```ts
type SellerType = "lojista" | "corretor" | "particular";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;            // WhatsApp, só dígitos com DDD
  sellerType: SellerType;
  storeName?: string;       // obrigatório para lojista
  city: string;
  state: string;            // UF
  avatarUrl?: string;
  createdAt: string;        // ISO
}

type PriceMode = "repasse" | "final" | "ambos";
type ListingStatus = "ativo" | "pausado" | "vendido";
type Fuel = "flex" | "gasolina" | "etanol" | "diesel" | "hibrido" | "eletrico";
type Transmission = "manual" | "automatico" | "cvt" | "automatizado";

interface VehicleCondition {
  hasAuctionHistory: boolean;   // passagem por leilão
  hasAccidentHistory: boolean;  // sinistro / batida de monta
  isFinanced: boolean;          // alienado
  hasDebts: boolean;            // IPVA, multas pendentes
  singleOwner: boolean;
  hasServiceRecords: boolean;   // revisões comprovadas
  hasSpareKey: boolean;
}

interface Listing {
  id: string;
  sellerId: string;
  plate: string;                // armazenada, mas exibida mascarada: ABC****
  brand: string;
  model: string;
  version: string;
  modelYear: number;
  manufactureYear: number;
  fuel: Fuel;
  transmission: Transmission;
  km: number;
  color: string;
  city: string;
  state: string;
  fipeCode?: string;
  fipePrice: number;
  priceMode: PriceMode;
  repassePrice?: number;
  finalPrice?: number;
  description: string;          // mínimo 80 caracteres
  condition: VehicleCondition;
  photos: string[];             // mínimo 1, máximo 15
  status: ListingStatus;
  views: number;
  createdAt: string;
  updatedAt: string;
}

interface Report {
  id: string;
  listingId: string;
  reason: "golpe" | "informacao_falsa" | "carro_vendido" | "outro";
  details?: string;
  createdAt: string;
}
```

Regras derivadas (`lib/fipe-math.ts`):
- `discountPercent = (fipePrice - preço) / fipePrice * 100`, arredondado para inteiro.
- O preço exibido como principal é o de repasse quando existir; senão, o final.
- Badge "Abaixo da FIPE" só aparece se o desconto for ≥ 1%. Se o preço estiver acima da FIPE, mostrar "X% acima da FIPE" em cinza, sem destaque.

---

## 2. Rotas

| Rota | Página | Acesso |
|---|---|---|
| `/` | Home | Público |
| `/carros` | Listagem com filtros | Público |
| `/carros/[id]` | Página do anúncio | Público |
| `/vendedor/[id]` | Perfil público do vendedor | Público |
| `/anunciar` | Wizard de novo anúncio | Logado |
| `/minha-conta/anuncios` | Meus anúncios | Logado |
| `/minha-conta/anuncios/[id]/editar` | Editar anúncio | Logado (dono) |
| `/minha-conta/favoritos` | Favoritos | Logado |
| `/minha-conta/perfil` | Editar perfil | Logado |
| `/entrar` e `/cadastro` | Autenticação mockada | Público |
| `/seguranca` | Dicas para negociar com segurança | Público |
| `/como-funciona` | Explicação de repasse × preço final | Público |
| `/termos` e `/privacidade` | Termos de uso e política (LGPD) | Público |

Rotas protegidas redirecionam para `/entrar?redirect=...` e voltam após o login.

---

## 3. Layout global

- **Header:** logo, links (Comprar, Como funciona, Segurança), botão primário **"Anunciar grátis"**, avatar/menu do usuário ou "Entrar".
- **Mobile:** header compacto + **bottom navigation** fixa com: Início, Buscar, Anunciar (botão central destacado), Favoritos, Conta.
- **Footer:** logo, slogan, links institucionais, Instagram @carrepasse01 e o **aviso de isenção** completo.

---

## 4. Páginas e comportamentos

### 4.1 Home
- **Hero:** título com efeito cromado ("Carros abaixo da FIPE. Sem enrolação."), slogan, busca rápida (marca, modelo, preço máximo, estado) e CTA secundário "Anunciar grátis".
- **Faixa de confiança:** 3 ícones — "FIPE em todo anúncio", "Estado real do carro", "Anuncie grátis".
- **Maiores descontos da semana:** carrossel com os anúncios de maior % abaixo da FIPE.
- **Recém-anunciados:** grid com os 8 mais recentes.
- **Para quem é:** três cards (Lojista, Corretor, Particular) explicando o benefício para cada um.
- **Como funciona:** 3 passos ilustrados (Digite a placa → Descreva o carro → Receba contatos no WhatsApp).
- **CTA final** para anunciar + link para o Instagram.

### 4.2 Listagem (`/carros`)
- Filtros: marca, modelo (dependente da marca), ano mín/máx, preço mín/máx, km máx, estado, cidade, câmbio, combustível, **modalidade** (repasse / preço final), **tipo de vendedor**, e toggles "Sem leilão" e "Sem sinistro".
- Ordenação: mais recentes, menor preço, maior desconto sobre a FIPE, menor km.
- **Filtros sincronizados com a URL** (query params), para que uma busca possa ser compartilhada.
- Desktop: filtros em sidebar. Mobile: botão "Filtros (n)" abrindo um drawer de baixo para cima.
- Chips removíveis com os filtros ativos + "Limpar tudo".
- Paginação com "Carregar mais" (12 por vez).
- Estado vazio com sugestão de afrouxar os filtros.

### 4.3 Card do anúncio
- Foto em proporção 4:3 com contador de fotos.
- Badge de desconto no canto ("-18% FIPE") com gradiente de marca.
- Selo da modalidade ("Repasse" / "Preço final" / ambos).
- Marca + modelo, versão, ano, km, cidade/UF.
- Preço em destaque e FIPE riscada logo abaixo em cinza.
- Selo do tipo de vendedor.
- Botão de favoritar (coração) sem sair da página.
- Alertas visuais pequenos se houver leilão ou sinistro.

### 4.4 Página do anúncio (`/carros/[id]`)
- Galeria com swipe no mobile, miniaturas no desktop e visualização em tela cheia.
- Título, versão, ano fab./modelo, km, cidade, data de publicação e visualizações.
- **Bloco de preço:** preço de repasse e/ou preço final (com explicação curta de cada modalidade num tooltip), valor FIPE com código e mês de referência, e barra visual comparando preço × FIPE.
- **Ficha técnica** em grid.
- **Transparência:** checklist do `VehicleCondition` com ícones verde/âmbar, bem visível.
- **Descrição do vendedor** completa.
- **Card do vendedor:** nome/loja, selo do tipo, cidade, membro desde, link para o perfil e botão **"Chamar no WhatsApp"** abrindo `wa.me` com mensagem pronta: *"Olá! Vi seu [modelo ano] no Car Repasse por R$ X. Ainda está disponível?"*
- **Bloco de vistoria cautelar:** explica por que fazer antes de comprar. Espaço reservado para "Parceiros de vistoria" (por enquanto com texto "Em breve").
- **Aviso de isenção** destacado perto do botão de contato.
- Botões **Compartilhar** (Web Share API com fallback de copiar link), **Favoritar** e **Denunciar anúncio** (modal com motivos do tipo `Report`).
- **Anúncios semelhantes** (mesma marca/modelo ou faixa de preço).
- Placa exibida sempre mascarada.
- `generateMetadata` com título, descrição e foto para Open Graph, para o link ficar bonito no WhatsApp e no Instagram.

### 4.5 Wizard "Anunciar" (`/anunciar`) — a funcionalidade mais importante
Formulário em etapas, com barra de progresso, rascunho salvo automaticamente no `localStorage` e possibilidade de voltar sem perder dados.

**Etapa 1 — Identificação do veículo**
- Campo de placa grande e central, com máscara e validação dos dois formatos.
- Ao confirmar, `services/plateLookup.ts` (mock) retorna marca, modelo, versão, anos, combustível e câmbio após um delay com animação de "Consultando...".
- Em seguida busca a FIPE correspondente e mostra um **card de confirmação** com os dados encontrados: "É este o seu carro?" → Confirmar / Corrigir.
- Link alternativo "Não sei a placa / preencher manualmente": selects encadeados marca → modelo → ano usando a API FIPE real.
- O mock de placa deve ter uns 15 veículos pré-definidos por placa e, para qualquer outra placa válida, gerar um veículo de forma determinística (mesma placa sempre retorna o mesmo carro).

**Etapa 2 — Detalhes e estado**
- Km, cor, cidade/UF (pré-preenchidos com o perfil).
- Checklist de condição (`VehicleCondition`) com linguagem clara.
- Descrição obrigatória (mín. 80 caracteres) com contador e **dicas ao lado**: lataria e pintura, mecânica, pneus, documentação, o que precisa de reparo.

**Etapa 3 — Fotos**
- Upload múltiplo (1 a 15) com preview, reordenação por arrastar e definição da foto de capa.
- Converter para data URL comprimida no próprio navegador para caber no `localStorage`.
- Dicas de boas fotos (frente, traseira, laterais, interior, painel com km, motor).

**Etapa 4 — Preço**
- Escolha da modalidade: Repasse, Preço final ou Ambos, com explicação curta de cada uma.
- Campos de valor com máscara BRL.
- **Feedback em tempo real** comparando com a FIPE: "Seu preço está 15% abaixo da FIPE — ótimo para repasse!" / "Seu preço está acima da FIPE".
- Se "Ambos", validar que o preço de repasse seja menor que o final.

**Etapa 5 — Revisão e publicação**
- Pré-visualização do anúncio exatamente como aparecerá.
- Checkbox obrigatório de aceite dos termos e do aviso de isenção.
- Publicar → tela de sucesso com botões "Ver anúncio", "Compartilhar no WhatsApp" e "Anunciar outro".

### 4.6 Minha conta
- **Meus anúncios:** lista com foto, título, preço, status, visualizações e ações: editar, pausar/reativar, marcar como vendido, excluir (com confirmação). Abas por status.
- **Editar anúncio:** reutiliza as etapas do wizard, sem refazer a consulta de placa.
- **Favoritos:** grid de cards; anúncios vendidos aparecem esmaecidos.
- **Perfil:** editar nome, telefone, cidade, tipo de vendedor e nome da loja.

### 4.7 Perfil público do vendedor
Nome/loja, selo do tipo, cidade, membro desde, total de anúncios ativos e grid com os anúncios dele.

### 4.8 Autenticação mockada
- Cadastro: nome, e-mail, WhatsApp, senha, cidade/UF e escolha visual do tipo (3 cards: Lojista, Corretor, Particular). Nome da loja obrigatório para lojista.
- Login com e-mail e senha comparando com o repositório local.
- Sessão guardada no `localStorage`, exposta por um hook `useAuth`.
- Deixar claro no código (comentário) que isso é temporário e será substituído por autenticação real.

### 4.9 Páginas institucionais
- **Segurança:** como evitar golpes (nunca pagar sinal antes de ver o carro, desconfiar de preço muito abaixo, conferir documentação, fazer vistoria cautelar, negociar em local público).
- **Como funciona:** o que é repasse, diferença para preço final, passo a passo para comprar e para vender.
- **Termos e Privacidade:** textos-base coerentes com o produto, incluindo a isenção de responsabilidade e menção à LGPD. Marcar como "rascunho — revisar com advogado".

---

## 5. Texto padrão do aviso de isenção

> O Car Repasse é uma plataforma de anúncios e não participa das negociações. Não nos responsabilizamos por negociações, pagamentos ou acordos realizados dentro ou fora da plataforma. Nunca faça pagamentos antecipados sem ver o veículo pessoalmente e recomendamos sempre realizar uma vistoria cautelar antes da compra.

---

## 6. Dados mockados (`mocks/`)

- **8 usuários:** 3 lojistas, 2 corretores, 3 particulares, espalhados pelo Nordeste e outras regiões.
- **30 anúncios** realistas do mercado brasileiro (Onix, HB20, Gol, Strada, Compass, Corolla, Civic, Kwid, T-Cross, Hilux, Renegade, Argo, Polo etc.), anos 2012–2024, com:
  - mistura das três modalidades de preço;
  - descontos variando de 3% a 25% abaixo da FIPE, e alguns acima;
  - alguns com leilão/sinistro sinalizados;
  - descrições escritas como um vendedor real escreveria;
  - status variados (a maioria ativos).
- Fotos: placeholders consistentes (pode usar imagens locais genéricas em `public/placeholders/` ou gerar SVGs com a silhueta do carro e o nome do modelo). Não usar hotlinks de imagens de terceiros.
- Seed carregado no primeiro acesso; botão escondido de "Resetar dados de demonstração" na página de perfil, visível só em desenvolvimento.

---

## 7. PWA

- `manifest.webmanifest` com nome "Car Repasse", cores do tema (`#0A0A0A` / `#7ED321`) e ícones gerados da logo.
- Permitir "Adicionar à tela inicial" para que funcione como aplicativo no celular.
- Service worker não é necessário nesta fase.

---

## 8. Fases de desenvolvimento

Execute uma fase por vez. Ao final de cada uma: rode lint e build, faça commit, dê push e resuma o que foi entregue.

1. **Setup:** criar o projeto Next.js dentro da pasta atual (preservando a pasta `logo/`), configurar Tailwind com os tokens, fontes, ESLint, estrutura de pastas, conectar ao repositório remoto e fazer o primeiro push.
2. **Design system:** componentes base em `components/ui`, header, footer, bottom nav e uma página `/dev/ui` (só em desenvolvimento) mostrando todos os componentes.
3. **Dados:** tipos, mocks, repositórios, serviços (FIPE real + placa mock) e helpers de formatação, com uso demonstrado.
4. **Vitrine:** home, listagem com filtros e card do anúncio.
5. **Anúncio:** página do anúncio completa, perfil público do vendedor e metadados de compartilhamento.
6. **Autenticação e conta:** cadastro, login, proteção de rotas, perfil e favoritos.
7. **Wizard de anúncio:** todas as etapas, rascunho automático, publicação, edição e gestão em "Meus anúncios".
8. **Institucional e acabamento:** páginas de segurança, como funciona, termos, privacidade, PWA, revisão de acessibilidade e responsividade, e um `README.md` explicando como rodar o projeto.

---

## 9. Critérios de pronto

- `npm run build` e `npm run lint` sem erros ou warnings.
- Nenhum erro no console do navegador.
- Todas as páginas funcionam bem em 360px, 768px e 1280px.
- Todo fluxo principal funciona de ponta a ponta: cadastrar-se → anunciar por placa → ver o anúncio publicado na listagem → favoritar com outra conta → chamar no WhatsApp.
- Recarregar a página não perde dados (persistência local funcionando).
- Nenhum componente acessa `localStorage` diretamente — só os repositórios.

---

## 10. Fora do escopo agora (não construir)

Backend e banco de dados reais, pagamentos e planos, anúncios em destaque pagos, chat interno, notificações push, consulta de placa real, painel administrativo, integração real com vistoria cautelar. A arquitetura deve apenas não atrapalhar essas evoluções.
