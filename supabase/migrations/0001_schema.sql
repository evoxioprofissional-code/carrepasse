-- Car Repasse — esquema inicial (perfis, anúncios, favoritos, denúncias, fotos).
-- Regra geral: todo mundo lê anúncios e perfis públicos; só o dono altera o que é seu.

create extension if not exists pgcrypto;

-- ─────────────────────────────── Perfis ───────────────────────────────
-- Um perfil por usuário do Supabase Auth. O telefone é público de propósito
-- (botão de WhatsApp do anúncio); o e-mail fica só em auth.users.
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null check (char_length(name) between 2 and 80),
  phone text not null check (phone ~ '^[0-9]{10,11}$'),
  seller_type text not null check (seller_type in ('lojista', 'corretor', 'particular')),
  store_name text check (store_name is null or char_length(store_name) between 2 and 80),
  city text not null,
  state char(2) not null,
  avatar_url text,
  is_demo boolean not null default false,
  created_at timestamptz not null default now(),
  constraint lojista_has_store check (seller_type <> 'lojista' or store_name is not null)
);

alter table public.profiles enable row level security;

create policy "perfis são públicos" on public.profiles
  for select using (true);
create policy "usuário cria o próprio perfil" on public.profiles
  for insert with check (auth.uid() = id);
create policy "usuário edita o próprio perfil" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id and is_demo = false);

-- ─────────────────────────────── Anúncios ─────────────────────────────
create table public.listings (
  id text primary key default gen_random_uuid()::text,
  seller_id uuid not null references public.profiles (id) on delete cascade,
  brand text not null,
  model text not null,
  version text not null,
  model_year smallint not null check (model_year between 1950 and 2100),
  manufacture_year smallint not null check (manufacture_year between 1950 and 2100),
  fuel text not null check (fuel in ('flex', 'gasolina', 'etanol', 'diesel', 'hibrido', 'eletrico')),
  transmission text not null check (transmission in ('manual', 'automatico', 'cvt', 'automatizado')),
  body_type text not null check (body_type in ('hatch', 'sedan', 'suv', 'picape')),
  km integer not null check (km >= 0),
  color text not null,
  city text not null,
  state char(2) not null,
  fipe_code text,
  fipe_price integer not null check (fipe_price >= 0),
  fipe_reference_month text,
  price_mode text not null check (price_mode in ('repasse', 'final', 'ambos')),
  repasse_price integer check (repasse_price > 0),
  final_price integer check (final_price > 0),
  description text not null check (char_length(description) >= 80),
  condition jsonb not null default '{}'::jsonb,
  photos text[] not null check (cardinality(photos) between 1 and 15),
  status text not null default 'ativo' check (status in ('ativo', 'pausado', 'vendido')),
  views integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- Preço principal (repasse quando existir) e % sobre a FIPE, para filtrar e ordenar no banco.
  main_price integer generated always as (coalesce(repasse_price, final_price)) stored,
  discount_percent integer generated always as (
    case when fipe_price > 0 and coalesce(repasse_price, final_price) > 0
      then round((fipe_price - coalesce(repasse_price, final_price)) * 100.0 / fipe_price)::integer
    end
  ) stored,
  constraint price_matches_mode check (
    (price_mode = 'repasse' and repasse_price is not null and final_price is null) or
    (price_mode = 'final' and final_price is not null and repasse_price is null) or
    (price_mode = 'ambos' and repasse_price is not null and final_price is not null and repasse_price < final_price)
  ),
  constraint years_order check (manufacture_year <= model_year)
);

create index listings_status_created_idx on public.listings (status, created_at desc);
create index listings_seller_idx on public.listings (seller_id);
create index listings_brand_model_idx on public.listings (brand, model);

alter table public.listings enable row level security;

create policy "anúncios são públicos" on public.listings
  for select using (true);
create policy "vendedor cria os próprios anúncios" on public.listings
  for insert with check (auth.uid() = seller_id);
create policy "vendedor edita os próprios anúncios" on public.listings
  for update using (auth.uid() = seller_id) with check (auth.uid() = seller_id);
create policy "vendedor exclui os próprios anúncios" on public.listings
  for delete using (auth.uid() = seller_id);

create function public.touch_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger listings_touch_updated_at
  before update on public.listings
  for each row execute function public.touch_updated_at();

-- Visualizações: qualquer visitante soma +1, sem poder editar o anúncio.
create function public.increment_listing_views(listing_id text) returns void
language sql security definer set search_path = public as $$
  update public.listings set views = views + 1 where id = listing_id;
$$;
revoke all on function public.increment_listing_views(text) from public;
grant execute on function public.increment_listing_views(text) to anon, authenticated;

-- ─────────────────────── Placa (privada do dono) ──────────────────────
-- A placa é guardada, mas nunca exposta: fica fora da tabela pública.
create table public.listing_plates (
  listing_id text primary key references public.listings (id) on delete cascade,
  plate text not null check (plate ~ '^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$')
);

alter table public.listing_plates enable row level security;

create policy "dono vê a placa" on public.listing_plates
  for select using (exists (select 1 from public.listings l where l.id = listing_id and l.seller_id = auth.uid()));
create policy "dono grava a placa" on public.listing_plates
  for insert with check (exists (select 1 from public.listings l where l.id = listing_id and l.seller_id = auth.uid()));
create policy "dono altera a placa" on public.listing_plates
  for update using (exists (select 1 from public.listings l where l.id = listing_id and l.seller_id = auth.uid()));

-- ─────────────────────────────── Favoritos ────────────────────────────
create table public.favorites (
  user_id uuid not null references auth.users (id) on delete cascade,
  listing_id text not null references public.listings (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, listing_id)
);

alter table public.favorites enable row level security;

create policy "usuário vê os próprios favoritos" on public.favorites
  for select using (auth.uid() = user_id);
create policy "usuário favorita" on public.favorites
  for insert with check (auth.uid() = user_id);
create policy "usuário desfavorita" on public.favorites
  for delete using (auth.uid() = user_id);

-- ─────────────────────────────── Denúncias ────────────────────────────
-- Qualquer pessoa denuncia (logada ou não); ninguém lê pelo app (só o painel admin, no futuro).
create table public.reports (
  id uuid primary key default gen_random_uuid(),
  listing_id text not null references public.listings (id) on delete cascade,
  reason text not null check (reason in ('golpe', 'informacao_falsa', 'carro_vendido', 'outro')),
  details text check (details is null or char_length(details) <= 500),
  reporter_id uuid references auth.users (id) on delete set null default auth.uid(),
  created_at timestamptz not null default now()
);

alter table public.reports enable row level security;

create policy "qualquer pessoa denuncia" on public.reports
  for insert with check (reporter_id is null or reporter_id = auth.uid());

-- ─────────────────────────────── Fotos (Storage) ──────────────────────
-- Leitura pública; cada usuário só envia/apaga dentro da própria pasta: <uid>/arquivo.jpg
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('listing-photos', 'listing-photos', true, 2097152, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

create policy "fotos de anúncio são públicas" on storage.objects
  for select using (bucket_id = 'listing-photos');
create policy "usuário envia fotos na própria pasta" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'listing-photos' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "usuário apaga as próprias fotos" on storage.objects
  for delete to authenticated
  using (bucket_id = 'listing-photos' and (storage.foldername(name))[1] = auth.uid()::text);
