-- Consulta de placa (API paga): cache por usuário e limite diário.
-- Cada pessoa só lê e grava as próprias consultas (RLS), então ninguém
-- consegue "plantar" dados falsos para a placa de outro usuário.
-- A rota /api/placa usa a sessão do usuário: sem chave secreta da Supabase.
create table if not exists public.plate_lookups (
  user_id uuid not null references auth.users (id) on delete cascade,
  plate text not null check (plate ~ '^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$'),
  result jsonb not null,
  provider text not null,
  fetched_at timestamptz not null default now(),
  primary key (user_id, plate)
);

create index if not exists plate_lookups_user_fetched_idx on public.plate_lookups (user_id, fetched_at desc);

alter table public.plate_lookups enable row level security;

drop policy if exists "usuário lê as próprias consultas" on public.plate_lookups;
create policy "usuário lê as próprias consultas" on public.plate_lookups
  for select using (auth.uid() = user_id);
drop policy if exists "usuário grava as próprias consultas" on public.plate_lookups;
create policy "usuário grava as próprias consultas" on public.plate_lookups
  for insert with check (auth.uid() = user_id);
drop policy if exists "usuário atualiza as próprias consultas" on public.plate_lookups;
create policy "usuário atualiza as próprias consultas" on public.plate_lookups
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
-- Sem política de delete: apagar o histórico não "zera" o limite diário.

-- fetched_at sempre é a hora do banco (o limite diário conta por ela).
create or replace function public.touch_plate_lookup() returns trigger
language plpgsql as $$
begin
  new.fetched_at := now();
  return new;
end;
$$;

drop trigger if exists plate_lookups_touch on public.plate_lookups;
create trigger plate_lookups_touch
  before insert or update on public.plate_lookups
  for each row execute function public.touch_plate_lookup();
