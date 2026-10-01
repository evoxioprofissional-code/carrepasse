-- Contatos: quantas vezes alguém tocou em "Chamar no WhatsApp" no anúncio.
-- Só o banco soma (função abaixo); o dono vê o número em "Meus anúncios".
alter table public.listings add column if not exists contacts integer not null default 0;

create or replace function public.register_listing_contact(listing_id text) returns void
language sql security definer set search_path = public as $$
  update public.listings set contacts = contacts + 1 where id = listing_id and status = 'ativo';
$$;
revoke all on function public.register_listing_contact(text) from public;
grant execute on function public.register_listing_contact(text) to anon, authenticated;

-- Colunas controladas pelo sistema: agora também "contacts".
create or replace function public.protect_listing_columns() returns trigger
language plpgsql as $$
begin
  if current_user in ('anon', 'authenticated') then
    if tg_op = 'INSERT' then
      new.views := 0;
      new.contacts := 0;
      new.created_at := now();
      new.confirmed_at := now();
    else
      new.views := old.views;
      new.contacts := old.contacts;
      new.created_at := old.created_at;
      if new.confirmed_at is distinct from old.confirmed_at
        or (new.status = 'ativo' and old.status <> 'ativo') then
        new.confirmed_at := now();
      end if;
    end if;
  end if;
  return new;
end;
$$;
