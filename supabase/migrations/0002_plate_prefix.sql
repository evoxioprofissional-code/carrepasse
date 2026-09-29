-- Placa mascarada pública (ex.: "PCZ" → exibida como PCZ****). A placa completa
-- continua só em listing_plates, visível apenas para o dono do anúncio.
alter table public.listings
  add column plate_prefix char(3) check (plate_prefix ~ '^[A-Z]{3}$');

update public.listings l
set plate_prefix = left(p.plate, 3)
from public.listing_plates p
where p.listing_id = l.id;

-- Mantém o prefixo sincronizado sempre que a placa for gravada ou trocada.
create function public.sync_plate_prefix() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  update public.listings set plate_prefix = left(new.plate, 3) where id = new.listing_id;
  return new;
end;
$$;

create trigger listing_plates_sync_prefix
  after insert or update of plate on public.listing_plates
  for each row execute function public.sync_plate_prefix();
