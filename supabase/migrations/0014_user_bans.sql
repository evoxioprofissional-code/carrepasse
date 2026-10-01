-- Banimento de contas pela equipe. banned_at nulo = conta ativa.
-- Soft ban: os anúncios do banido somem da vitrine e ele não pode publicar/editar.
-- (A sessão no Auth não é derrubada aqui; fica para um passo futuro, se precisar.)

alter table public.profiles add column if not exists banned_at timestamptz;

-- Checa "banido" sem esbarrar em RLS — usada nas políticas de anúncio.
create or replace function public.is_banned(uid uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = uid and banned_at is not null);
$$;
revoke all on function public.is_banned(uuid) from public;
grant execute on function public.is_banned(uuid) to anon, authenticated;

-- Vitrine esconde anúncios de vendedor banido (admin ainda vê tudo).
-- ALTER (em vez de drop+create) para não abrir brecha de RLS durante a troca.
alter policy "anúncios são públicos" on public.listings
  using (not public.is_banned(seller_id) or public.is_admin());

-- Vendedor banido não cria nem edita anúncios.
alter policy "vendedor cria os próprios anúncios" on public.listings
  with check (auth.uid() = seller_id and not public.is_banned(auth.uid()));

alter policy "vendedor edita os próprios anúncios" on public.listings
  using (auth.uid() = seller_id and not public.is_banned(auth.uid()))
  with check (auth.uid() = seller_id);

-- Banir / desbanir: só admin, nunca outro admin nem conta de demonstração.
create or replace function public.admin_set_ban(target uuid, banned boolean) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then
    raise exception 'Apenas administradores.' using errcode = 'insufficient_privilege';
  end if;
  if banned and exists (select 1 from public.admins where user_id = target) then
    raise exception 'Não é possível banir um administrador.' using errcode = 'check_violation';
  end if;
  update public.profiles
    set banned_at = case when banned then now() else null end
    where id = target and is_demo = false;
end;
$$;
revoke all on function public.admin_set_ban(uuid, boolean) from public;
grant execute on function public.admin_set_ban(uuid, boolean) to authenticated;
