# Banco de dados (Supabase)

Projeto `carrepasse` (ref `xpsklsfvbvzxsibesylf`, região `sa-east-1`).

## Estrutura

- `migrations/` — esquema versionado, aplicado em ordem (0001, 0002…).
  - `profiles` (perfil público de cada usuário do Auth), `listings` (anúncios),
    `listing_plates` (placa completa, só o dono lê), `favorites`, `reports`.
  - RLS em todas as tabelas: leitura pública de anúncios/perfis, escrita só do dono,
    denúncia aberta a qualquer visitante e sem leitura pelo app.
  - Bucket `listing-photos` (público para leitura; upload só na pasta `<uid>/`).
- `seed.sql` — anúncios de demonstração, gerado a partir de `mocks/`.
  Os 8 vendedores são usuários `demo+...@example.com` com senha aleatória descartada
  (IDs fixos `00000000-0000-4000-8000-0000000001xx`), criados antes pela API admin do Auth.
  Eles precisam de `app_metadata.demo = true` (só a API admin grava esse campo); sem isso,
  o gatilho de cadastro tentaria criar o perfil a partir do formulário.

## Como aplicar

Pelo SQL Editor do painel da Supabase (ou pela Management API), rode as migrações
em ordem e depois o `seed.sql`. As chaves secretas nunca vão para o repositório.

No app, `lib/supabase/config.ts` usa `NEXT_PUBLIC_SUPABASE_URL` e
`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` quando definidas; sem elas, usa os valores
públicos deste projeto.

## E-mails do Auth

Sem SMTP próprio a Supabase envia só 2 e-mails/hora e só para a equipe do projeto, e não deixa
editar os modelos. Depois de configurar o Resend em *Auth > SMTP Settings*, cole
`templates/recovery.html` em *Auth > Email Templates > Reset Password*: o link com `token_hash`
funciona mesmo abrindo o e-mail em outro navegador (ex.: app do Gmail).
