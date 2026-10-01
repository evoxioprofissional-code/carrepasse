-- "Baixou o preço": quando o preço principal (repasse, ou final se não houver)
-- cai, o banco guarda o preço anterior e a data. O app mostra o selo por 14 dias.
-- Só o banco grava essas colunas; se o preço subir, o selo some.
alter table public.listings
  add column if not exists previous_price integer,
  add column if not exists price_dropped_at timestamptz;

create or replace function public.track_price_drop() returns trigger
language plpgsql as $$
declare
  old_price integer;
  new_price integer;
begin
  if tg_op = 'INSERT' then
    new.previous_price := null;
    new.price_dropped_at := null;
    return new;
  end if;

  -- Ninguém edita estas colunas direto: partem sempre do valor anterior.
  new.previous_price := old.previous_price;
  new.price_dropped_at := old.price_dropped_at;

  -- main_price é coluna gerada e ainda não foi calculada neste ponto.
  old_price := coalesce(old.repasse_price, old.final_price);
  new_price := coalesce(new.repasse_price, new.final_price);
  if new_price < old_price then
    new.previous_price := old_price;
    new.price_dropped_at := now();
  elsif new_price > old_price then
    new.previous_price := null;
    new.price_dropped_at := null;
  end if;
  return new;
end;
$$;

drop trigger if exists listings_track_price_drop on public.listings;
create trigger listings_track_price_drop
  before insert or update on public.listings
  for each row execute function public.track_price_drop();
