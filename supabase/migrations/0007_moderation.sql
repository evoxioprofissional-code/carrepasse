-- Moderação: administradores leem as denúncias, pausam anúncios suspeitos
-- e marcam a denúncia como resolvida ou descartada.

-- ─────────────── Administradores ───────────────
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;

-- Cada um só consegue ver se ele mesmo é admin (o app usa isso para mostrar o painel).
drop policy if exists "admin vê o próprio registro" on public.admins;
create policy "admin vê o próprio registro" on public.admins
  for select using (auth.uid() = user_id);

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- ─────────────── Denúncias ───────────────
alter table public.reports
  add column if not exists status text not null default 'aberta'
    check (status in ('aberta', 'resolvida', 'descartada')),
  add column if not exists resolved_at timestamptz,
  add column if not exists resolved_by uuid references auth.users (id) on delete set null;

create index if not exists reports_status_created_idx on public.reports (status, created_at desc);

-- Quem denuncia não escolhe a situação da denúncia.
drop policy if exists "qualquer pessoa denuncia" on public.reports;
create policy "qualquer pessoa denuncia" on public.reports
  for insert with check (
    (reporter_id is null or reporter_id = auth.uid())
    and status = 'aberta' and resolved_at is null and resolved_by is null
  );

drop policy if exists "admin lê denúncias" on public.reports;
create policy "admin lê denúncias" on public.reports
  for select using (public.is_admin());

drop policy if exists "admin resolve denúncias" on public.reports;
create policy "admin resolve denúncias" on public.reports
  for update using (public.is_admin()) with check (public.is_admin());

-- ─────────────── Anúncios ───────────────
-- Admin pode pausar (ou reativar) qualquer anúncio.
drop policy if exists "admin modera anúncios" on public.listings;
create policy "admin modera anúncios" on public.listings
  for update using (public.is_admin()) with check (public.is_admin());

-- Primeiro administrador: o dono do projeto.
insert into public.admins (user_id)
select id from auth.users where email = 'evoxioprofissional@gmail.com'
on conflict (user_id) do nothing;
