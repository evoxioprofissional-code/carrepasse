-- O mesmo vendedor não publica a mesma placa em dois anúncios ativos
-- (anúncio repetido para aparecer mais). Vendedores diferentes podem:
-- no repasse o carro passa de mão em mão.
create or replace function public.prevent_duplicate_plate() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  seller uuid;
  own_status text;
begin
  select seller_id, status into seller, own_status from public.listings where id = new.listing_id;
  -- Só importa se este anúncio está ativo (reativar é checado no outro gatilho).
  if own_status = 'ativo' and exists (
    select 1
    from public.listing_plates p
    join public.listings l on l.id = p.listing_id
    where p.plate = new.plate
      and p.listing_id <> new.listing_id
      and l.seller_id = seller
      and l.status = 'ativo'
  ) then
    raise exception 'Você já tem um anúncio ativo com esta placa.' using errcode = 'unique_violation';
  end if;
  return new;
end;
$$;

drop trigger if exists listing_plates_no_duplicate on public.listing_plates;
create trigger listing_plates_no_duplicate
  before insert or update of plate on public.listing_plates
  for each row execute function public.prevent_duplicate_plate();

create index if not exists listing_plates_plate_idx on public.listing_plates (plate);

-- Reativar um anúncio pausado/vendido também não pode duplicar a placa.
create or replace function public.prevent_duplicate_plate_on_activate() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if new.status = 'ativo' and old.status <> 'ativo' and exists (
    select 1
    from public.listing_plates mine
    join public.listing_plates other on other.plate = mine.plate and other.listing_id <> mine.listing_id
    join public.listings l on l.id = other.listing_id
    where mine.listing_id = new.id
      and l.seller_id = new.seller_id
      and l.status = 'ativo'
  ) then
    raise exception 'Você já tem um anúncio ativo com esta placa.' using errcode = 'unique_violation';
  end if;
  return new;
end;
$$;

drop trigger if exists listings_no_duplicate_plate on public.listings;
create trigger listings_no_duplicate_plate
  before update of status on public.listings
  for each row execute function public.prevent_duplicate_plate_on_activate();
