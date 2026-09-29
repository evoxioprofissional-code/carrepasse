-- Cria o perfil no mesmo momento do cadastro, com os dados enviados em
-- options.data do signUp. Se algum dado for inválido (checks da tabela),
-- o cadastro inteiro falha — não sobra usuário sem perfil.
create function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  meta jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
begin
  -- Usuários de demonstração (seed) ganham perfil pelo seed.sql.
  if coalesce((meta ->> 'demo')::boolean, false) then
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

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
