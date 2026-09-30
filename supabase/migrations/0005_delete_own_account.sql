-- Excluir a própria conta (LGPD: direito de eliminação dos dados).
-- Apaga o usuário do Auth; o resto vai em cascata:
--   profiles → listings → listing_plates; favorites. Denúncias feitas pela
--   pessoa ficam anônimas (reporter_id vira null).
-- As fotos do Storage são apagadas pelo app antes de chamar esta função.
create or replace function public.delete_own_account() returns void
language plpgsql security definer set search_path = public as $$
declare
  uid uuid := auth.uid();
begin
  if uid is null then
    raise exception 'Faça login para excluir a conta.' using errcode = 'insufficient_privilege';
  end if;
  if exists (select 1 from public.profiles where id = uid and is_demo) then
    raise exception 'Contas de demonstração não podem ser excluídas.' using errcode = 'insufficient_privilege';
  end if;
  delete from auth.users where id = uid;
end;
$$;

revoke all on function public.delete_own_account() from public, anon;
grant execute on function public.delete_own_account() to authenticated;
