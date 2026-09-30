-- Anúncios vencem: sem confirmação do vendedor por 60 dias, o anúncio ativo
-- sai da busca (o app filtra por confirmed_at). O vendedor confirma que o carro
-- ainda está à venda com um clique em "Meus anúncios".

alter table public.listings
  add column if not exists confirmed_at timestamptz not null default now();

create index if not exists listings_status_confirmed_idx on public.listings (status, confirmed_at desc);

-- confirmed_at só é gravado pelo sistema: qualquer alteração vinda do app vira
-- now(), e reativar um anúncio (pausado/vendido → ativo) também renova.
create or replace function public.protect_listing_columns() returns trigger
language plpgsql as $$
begin
  if current_user in ('anon', 'authenticated') then
    if tg_op = 'INSERT' then
      new.views := 0;
      new.created_at := now();
      new.confirmed_at := now();
    else
      new.views := old.views;
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
