-- Painel do administrador: números do site numa chamada só.
-- Os usuários e anúncios de demonstração (seed) ficam fora das contas
-- principais e aparecem à parte, para lembrar de removê-los no lançamento.
create or replace function public.admin_stats() returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare
  week_ago timestamptz := now() - interval '7 days';
  month_ago timestamptz := now() - interval '30 days';
  -- Mesmo prazo de lib/listing-expiry.ts (LISTING_TTL_DAYS).
  expiry_cutoff timestamptz := now() - interval '60 days';
  result jsonb;
begin
  if not public.is_admin() then
    raise exception 'Acesso restrito' using errcode = '42501';
  end if;

  with real_profiles as (
    select * from public.profiles where not is_demo
  ),
  real_listings as (
    select l.* from public.listings l join real_profiles p on p.id = l.seller_id
  )
  select jsonb_build_object(
    'users', jsonb_build_object(
      'total', (select count(*) from real_profiles),
      'newLast7Days', (select count(*) from real_profiles where created_at >= week_ago),
      'lojista', (select count(*) from real_profiles where seller_type = 'lojista'),
      'corretor', (select count(*) from real_profiles where seller_type = 'corretor'),
      'particular', (select count(*) from real_profiles where seller_type = 'particular')
    ),
    'listings', jsonb_build_object(
      'active', (select count(*) from real_listings where status = 'ativo' and confirmed_at >= expiry_cutoff),
      'expired', (select count(*) from real_listings where status = 'ativo' and confirmed_at < expiry_cutoff),
      'paused', (select count(*) from real_listings where status = 'pausado'),
      'sold', (select count(*) from real_listings where status = 'vendido'),
      'newLast7Days', (select count(*) from real_listings where created_at >= week_ago),
      'views', (select coalesce(sum(views), 0) from real_listings),
      'contacts', (select coalesce(sum(contacts), 0) from real_listings)
    ),
    'favorites', (select count(*) from public.favorites f join real_listings l on l.id = f.listing_id),
    'reports', jsonb_build_object(
      'open', (select count(*) from public.reports where status = 'aberta'),
      'newLast7Days', (select count(*) from public.reports where created_at >= week_ago)
    ),
    'plateLookups', jsonb_build_object(
      'last7Days', (select count(*) from public.plate_lookups where fetched_at >= week_ago),
      'last30Days', (select count(*) from public.plate_lookups where fetched_at >= month_ago)
    ),
    'demo', jsonb_build_object(
      'users', (select count(*) from public.profiles where is_demo),
      'listings', (select count(*) from public.listings l join public.profiles p on p.id = l.seller_id where p.is_demo)
    ),
    'generatedAt', now()
  ) into result;

  return result;
end;
$$;

revoke all on function public.admin_stats() from public, anon;
grant execute on function public.admin_stats() to authenticated;
