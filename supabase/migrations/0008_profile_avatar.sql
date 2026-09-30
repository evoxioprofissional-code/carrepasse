-- Foto de perfil / logo da loja: só imagem do nosso Storage, na pasta do
-- próprio usuário (<uid>/perfil/...). null remove a foto.
create or replace function public.validate_profile_avatar() returns trigger
language plpgsql as $$
begin
  if new.avatar_url is null
    or (tg_op = 'UPDATE' and new.avatar_url is not distinct from old.avatar_url)
    or current_user not in ('anon', 'authenticated') then
    return new;
  end if;

  if not (
    new.avatar_url ~ '^https://[a-z0-9]+\.supabase\.co/storage/v1/object/public/listing-photos/'
    and position('/listing-photos/' || new.id::text || '/perfil/' in new.avatar_url) > 0
  ) then
    raise exception 'Foto de perfil fora do armazenamento do Car Repasse.' using errcode = 'check_violation';
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_validate_avatar on public.profiles;
create trigger profiles_validate_avatar
  before insert or update of avatar_url on public.profiles
  for each row execute function public.validate_profile_avatar();
