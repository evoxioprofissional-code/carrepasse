# Estado do projeto

Passagem de bastão entre sessões de trabalho. Leia junto com o `CLAUDE.md` (como construir) e
atualize este arquivo ao terminar cada entrega.

_Última atualização: 01/10/2026._

## Onde estamos

As 8 fases do `SPEC.md` foram concluídas e o projeto foi além do protótipo:

- **Banco real na Supabase** (Auth, Postgres com RLS e Storage). Migrações `0001` a `0013` aplicadas
  em produção (lista no `README.md`).
- **Anúncio pela placa:** a rota `/api/placa` consulta a API Placas (wdapi2), com cache por usuário de
  180 dias e limite de 10 consultas por dia. Sem `API_PLACAS_TOKEN`, a placa é simulada
  (`services/plateMock.ts`). A placa é obrigatória, e o mesmo vendedor não pode ter dois anúncios
  ativos com a mesma placa.
- **Ciclo do anúncio:** vence depois de 60 dias sem o vendedor confirmar ("Ainda está à venda"), com
  aviso 7 dias antes. Mostra contador de visitas e de contatos pelo WhatsApp e o selo "Baixou o preço"
  por 14 dias.
- **Divulgação:** imagem para stories do Instagram (`/carros/[id]/story`) e imagem de compartilhamento.
  As páginas do anúncio e do vendedor são geradas no servidor (SEO e JSON-LD).
- **Páginas por marca e cidade** (`/carros/marca/[marca]`, `/carros/cidade/[cidade]`): landing SSR com
  a FIPE, grade de anúncios, metadados, JSON-LD (CollectionPage + BreadcrumbList) e links internos.
  Entram no `sitemap.xml` e há um bloco "Navegue por marca e cidade" no rodapé de `/carros`.
  Pré-geradas no build e revalidadas a cada 1h.
- **Conta:** foto ou logo, "Esqueci minha senha" e exclusão da própria conta (LGPD).
- **Painel da equipe (`/admin`, só administradores):** shell com abas (Painel · Usuários · Anúncios ·
  Denúncias · Faturamento), dashboard de métricas repaginado (KPIs + composição por tipo de usuário e
  situação dos anúncios, dado real do `admin_stats`) e moderação de denúncias em `/admin/denuncias`.
  **Em construção** (placeholders honestos, sem dado falso): Usuários (listar/banir), Anúncios (moderar)
  e Faturamento (desenhado, mas sem pagamento conectado — "anunciar é grátis" segue valendo).

Produção: https://www.carrepasse.com.br. A Vercel publica a cada push na `main`.

## Decisões do dono (não mudar sem perguntar)

- Anunciar é grátis: nada de planos, pagamentos ou destaque pago.
- A placa é obrigatória no anúncio.
- O cadastro não pede verificação de e-mail (`mailer_autoconfirm` ligado na Supabase). Não há botão
  "Trocar senha" por enquanto.
- O Vercel Analytics está desligado (liga com `NEXT_PUBLIC_VERCEL_ANALYTICS=1`).
- Commit e push direto na `main` estão autorizados quando `npm run lint`, `npm test` e `npm run build`
  passam.
- Administrador: `evoxioprofissional@gmail.com`. Admins ficam na tabela `public.admins`, e só se
  adiciona alguém pelo banco (o site não tem esse botão, de propósito).

## Pendências que dependem de terceiros

1. **API Placas (plano premium, cadastro em análise).** Quando liberar:
   - colocar o `API_PLACAS_TOKEN` nas variáveis de ambiente da Vercel (só servidor) e publicar de novo;
   - testar uma placa real;
   - com um exemplo de resposta do plano premium, preencher sozinho o checklist do estado do veículo
     (leilão, sinistro, roubo/furto, financiamento, débitos) com selo "Verificado". O leitor da
     resposta é `services/apiPlacas.ts`, com testes em `services/apiPlacas.test.ts`.
2. **E-mail próprio:** configurar o Resend como SMTP da Supabase, com o DNS de `carrepasse.com.br`.
   Depois, colar `supabase/templates/recovery.html` em Auth > Email Templates > Reset Password. Sem
   isso, o "Esqueci minha senha" só envia 2 e-mails por hora.
3. **Captcha (Cloudflare Turnstile):** criar a chave na Cloudflare, colocar
   `NEXT_PUBLIC_TURNSTILE_SITE_KEY` na Vercel e ligar o captcha em Auth > Attack Protection na
   Supabase, com a chave secreta. Tem que ser tudo junto; ligar só um lado quebra o login.
4. **Revisão jurídica** de `/termos` e `/privacidade`, que estão marcados como rascunho (falta o CNPJ).
5. **Vercel:** confirmar `www.carrepasse.com.br` como domínio principal.
6. **Lançamento:** remover os 8 usuários e 30 anúncios de demonstração (`profiles.is_demo`). O painel
   `/admin` mostra quantos ainda restam.

## Próximos passos sugeridos (não dependem de ninguém)

- Botão no painel da equipe para remover os dados de demonstração. Confirmar com o dono antes, porque
  apaga dados.
- Páginas por marca+modelo e filtros fixos (ex.: "Carros abaixo da FIPE em Recife"), evoluindo as
  landing de SEO que já existem.

## Como trabalhar

### Rodar no computador

`npm install` e `npm run dev -- -p 3010`. **O app local usa o banco de produção:** contas e anúncios
criados nos testes aparecem no site de verdade, então apague-os depois. A porta 3010 já está liberada
na Supabase para os links de login e de senha.

### Banco de dados

- Toda mudança de esquema vira uma migração nova em `supabase/migrations/` (a próxima é a `0014_…`) e
  ganha uma linha na lista do `README.md`.
- Para aplicar: `sh supabase/query.sh -f supabase/migrations/0014_….sql`, ou colar o arquivo no SQL
  Editor da Supabase. Consultas avulsas: `sh supabase/query.sh "select …"`.
- No computador, o `query.sh` precisa de um token pessoal da Supabase
  (supabase.com/dashboard/account/tokens), na variável `SUPABASE_ACCESS_TOKEN`: no terminal ou numa
  linha do `.env.local`, que o git ignora. Nunca commitar o token nem colá-lo no chat.
- Teste antes de aplicar, sem deixar rastro: um bloco que termina em erro desfaz tudo o que fez.
  ```sql
  do $$ begin
    -- mudanças e consultas de teste…
    raise exception 'RESULTADO (desfeito): %', 'valor conferido';
  end $$;
  ```
- **Não use `supabase db push`.** As migrações foram aplicadas pelo SQL, sem o histórico da CLI, e ela
  tentaria rodar todas de novo.
