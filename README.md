# Car Repasse

Marketplace de carros com foco em **repasse** (abaixo da FIPE) e **preço final**. FIPE e estado real
em todo anúncio, contato direto pelo WhatsApp e anúncio grátis pela placa.

**Preço baixo. Verdade sempre.** · Produção: https://carrepasse.vercel.app

## Stack

- Next.js 16 (App Router) + TypeScript strict + Tailwind CSS 3.4
- Supabase: Postgres com RLS, Auth (e-mail e senha) e Storage (fotos)
- APIs: FIPE pública da Parallelum, IBGE Localidades
- Formulários com react-hook-form + zod; ícones lucide-react; galeria embla-carousel
- Deploy na Vercel (a cada push na `main`)

As regras do projeto (visual, convenções, mobile first) estão no [`CLAUDE.md`](./CLAUDE.md); o que
construir está no [`SPEC.md`](./SPEC.md).

## Rodando localmente

Requisitos: Node 20+ e npm.

```bash
npm install
npm run dev -- -p 3010
```

Abra http://localhost:3010. O app já aponta para o projeto Supabase de produção (URL e chave
publicável são públicas por natureza; os dados são protegidos pelas regras de RLS).

### Variáveis de ambiente (opcionais)

Crie um `.env.local` só se quiser apontar para outro projeto ou domínio:

| Variável | Para quê |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL de outro projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Chave publicável desse projeto |
| `NEXT_PUBLIC_SITE_URL` | Domínio usado nos links de compartilhamento (na Vercel é automático) |

Nunca coloque chaves secretas (`sb_secret_…`, `service_role`) no código nem em variáveis `NEXT_PUBLIC_`.

## Scripts

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção (roda antes de cada commit) |
| `npm run lint` | ESLint (precisa passar sem erros nem avisos) |
| `npm start` | Serve o build de produção |

## Banco de dados

Esquema, regras de acesso e seed ficam em [`supabase/`](./supabase/README.md):

- `migrations/0001_schema.sql` — perfis, anúncios, placa privada, favoritos, denúncias, bucket de fotos
- `migrations/0002_plate_prefix.sql` — prefixo público da placa (ABC****)
- `migrations/0003_profile_on_signup.sql` — perfil criado junto com o cadastro
- `seed.sql` — 30 anúncios e 8 vendedores de demonstração (gerado a partir de `mocks/`)

Para montar um projeto novo: rode as migrações em ordem e depois o seed no SQL Editor da Supabase.
No painel de Auth, deixe a senha mínima em 8 caracteres e cadastre o domínio do site em *URL Configuration*.

## Estrutura

```
app/            Rotas: home, /carros, /carros/[id], /vendedor/[id], /anunciar, /minha-conta/*,
                /entrar, /cadastro, /seguranca, /como-funciona, /termos, /privacidade, /creditos
components/     ui/ (base), layout/, home/, listing/, forms/wizard/, account/, auth/, content/
repositories/   Único acesso a dados (Supabase e localStorage)
services/       FIPE, IBGE e consulta de placa (mock)
lib/            Formatação, placa, cálculo da FIPE, validação, Supabase
mocks/          Seed de demonstração e catálogo FIPE de plano B
supabase/       Migrações e seed
public/         Logo, ícones do app e fotos de demonstração (créditos em /creditos)
```

## App no celular (PWA)

O site tem manifesto e ícones: no Android, “Adicionar à tela inicial”; no iPhone, Compartilhar →
“Adicionar à Tela de Início”. Ele abre em tela cheia, como app.

## O que ainda falta

- Consulta de placa real (API Placas) — hoje simulada.
- “Esqueci minha senha” — depende de um provedor de e-mail (Resend).
- Revisão jurídica dos Termos e da Política de Privacidade (marcados como rascunho).
