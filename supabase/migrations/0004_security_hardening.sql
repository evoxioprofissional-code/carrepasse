-- Endurecimento das regras do banco (revisão geral do projeto).
--
-- 1. "Usuário de demonstração" deixa de ser escolhido por quem se cadastra:
--    o sinal vem de raw_app_meta_data, que só a API admin grava.
-- 2. Ninguém cria o próprio perfil já marcado como demonstração.
-- 3. O dono do anúncio não altera visualizações nem a data de publicação
--    (mudar a data colocava o anúncio no topo de "Mais recentes").
-- 4. Fotos só do nosso Storage, na pasta do próprio vendedor; as imagens
--    de demonstração (/demo, /placeholders) ficam só para os perfis demo.

-- ─────────────── 1. Perfil criado no cadastro ───────────────
-- Os usuários demo do seed foram marcados em user_metadata; a marca passa
-- para app_metadata (só estes 8, que já têm perfil demo).
update auth.users u
set raw_app_meta_data = coalesce(u.raw_app_meta_data, '{}'::jsonb) || '{"demo": true}'::jsonb
where u.raw_user_meta_data ->> 'demo' = 'true'
  and exists (select 1 from public.profiles p where p.id = u.id and p.is_demo);

create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  meta jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
begin
  -- Usuários de demonstração (seed) ganham perfil pelo seed.sql.
  if coalesce(new.raw_app_meta_data ->> 'demo', '') = 'true' then
    return new;
  end if;

  insert into public.profiles (id, name, phone, seller_type, store_name, city, state)
  values (
    new.id,
    trim(meta ->> 'name'),
    regexp_replace(coalesce(meta ->> 'phone', ''), '\D', '', 'g'),
    meta ->> 'seller_type',
    nullif(trim(coalesce(meta ->> 'store_name', '')), ''),
    trim(meta ->> 'city'),
    upper(meta ->> 'state')
  );
  return new;
end;
$$;

-- ─────────────── 2. Perfil criado pelo próprio usuário ───────────────
drop policy if exists "usuário cria o próprio perfil" on public.profiles;
create policy "usuário cria o próprio perfil" on public.profiles
  for insert with check (auth.uid() = id and is_demo = false);

-- ─────────────── 3. Colunas controladas pelo sistema ───────────────
-- Vale para quem usa o app (anon/authenticated). Funções security definer
-- (ex.: increment_listing_views) e o seed rodam como dono e passam direto.
create or replace function public.protect_listing_columns() returns trigger
language plpgsql as $$
begin
  if current_user in ('anon', 'authenticated') then
    if tg_op = 'INSERT' then
      new.views := 0;
      new.created_at := now();
    else
      new.views := old.views;
      new.created_at := old.created_at;
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists listings_protect_columns on public.listings;
create trigger listings_protect_columns
  before insert or update on public.listings
  for each row execute function public.protect_listing_columns();

-- ─────────────── 4. Origem das fotos ───────────────
create or replace function public.validate_listing_photos() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  photo text;
  seller_is_demo boolean;
  own_prefix text := '/storage/v1/object/public/listing-photos/' || new.seller_id::text || '/';
begin
  if tg_op = 'UPDATE' and new.photos is not distinct from old.photos then
    return new;
  end if;

  select is_demo into seller_is_demo from public.profiles where id = new.seller_id;

  foreach photo in array new.photos loop
    if photo ~ '^/(demo|placeholders)/[A-Za-z0-9._-]+$' then
      if not coalesce(seller_is_demo, false) then
        raise exception 'Imagens de demonstração só em anúncios de demonstração.' using errcode = 'check_violation';
      end if;
    elsif not (photo ~ '^https://[a-z0-9]+\.supabase\.co/' and position(own_prefix in photo) > 0) then
      raise exception 'Foto fora do armazenamento do Car Repasse.' using errcode = 'check_violation';
    end if;
  end loop;
  return new;
end;
$$;

drop trigger if exists listings_validate_photos on public.listings;
create trigger listings_validate_photos
  before insert or update of photos on public.listings
  for each row execute function public.validate_listing_photos();
