import { supabase } from "@/lib/supabase/client";
import type { SellerType } from "@/types/user";
import { photoRepository } from "./photoRepository";

export interface SignUpInput {
  email: string;
  password: string;
  name: string;
  phone: string;
  sellerType: SellerType;
  storeName?: string;
  city: string;
  state: string;
}

export interface AuthUser {
  id: string;
  email: string;
}

/** Mensagens do Supabase Auth → português claro para o usuário. */
export function translateAuthError(message: string): string {
  const text = message.toLowerCase();
  if (text.includes("invalid login credentials")) return "E-mail ou senha incorretos.";
  if (text.includes("already registered") || text.includes("already been registered")) {
    return "Já existe uma conta com este e-mail. Tente entrar.";
  }
  if (text.includes("password should be at least")) return "A senha precisa ter pelo menos 8 caracteres.";
  if (text.includes("unable to validate email") || text.includes("invalid email")) return "Confira o e-mail digitado.";
  if (text.includes("rate limit") || text.includes("too many")) return "Muitas tentativas seguidas. Espere um minuto e tente de novo.";
  if (text.includes("database error")) return "Não foi possível criar sua conta. Confira os dados e tente de novo.";
  if (text.includes("fetch")) return "Sem conexão com o servidor. Verifique sua internet.";
  return "Algo deu errado. Tente de novo em instantes.";
}

export const authRepository = {
  /** Devolve `needsConfirmation` quando a Supabase exige confirmar o e-mail antes de entrar. */
  async signUp(input: SignUpInput): Promise<{ needsConfirmation: boolean }> {
    const { data, error } = await supabase().auth.signUp({
      email: input.email.trim().toLowerCase(),
      password: input.password,
      options: {
        // O perfil é criado por um gatilho no banco a partir destes dados.
        data: {
          name: input.name.trim(),
          phone: input.phone.replace(/\D/g, ""),
          seller_type: input.sellerType,
          store_name: input.sellerType === "lojista" ? input.storeName?.trim() : null,
          city: input.city.trim(),
          state: input.state,
        },
      },
    });
    if (error) throw new Error(translateAuthError(error.message));
    return { needsConfirmation: !data.session };
  },

  async signIn(email: string, password: string): Promise<void> {
    const { error } = await supabase().auth.signInWithPassword({ email: email.trim().toLowerCase(), password });
    if (error) throw new Error(translateAuthError(error.message));
  },

  /**
   * Envia o link de redefinição. Não revela se o e-mail tem conta: a tela
   * mostra a mesma mensagem nos dois casos.
   */
  async requestPasswordReset(email: string): Promise<void> {
    const { error } = await supabase().auth.resetPasswordForEmail(email.trim().toLowerCase(), {
      redirectTo: `${window.location.origin}/auth/confirm?next=/redefinir-senha`,
    });
    if (error && /rate limit|too many/i.test(error.message)) throw new Error(translateAuthError(error.message));
  },

  /** Troca a senha de quem entrou pelo link de recuperação (ou já está logado). */
  async updatePassword(password: string): Promise<void> {
    const { error } = await supabase().auth.updateUser({ password });
    if (error) {
      if (/different from the old|same.*password/i.test(error.message)) {
        throw new Error("A nova senha precisa ser diferente da atual.");
      }
      if (/session|jwt|not authenticated/i.test(error.message)) {
        throw new Error("O link expirou. Peça um novo link de redefinição.");
      }
      throw new Error(translateAuthError(error.message));
    }
  },

  /**
   * Exclui a conta de quem está logado: primeiro as fotos dos anúncios no
   * Storage, depois a conta (o banco apaga perfil, anúncios e favoritos).
   */
  async deleteAccount(userId: string): Promise<void> {
    const { data } = await supabase().from("listings").select("photos").eq("seller_id", userId);
    const photos = (data ?? []).flatMap((row: { photos: string[] }) => row.photos);
    await photoRepository.remove(photos).catch(() => {
      // Foto que sobrar não impede a exclusão da conta.
    });
    const { error } = await supabase().rpc("delete_own_account");
    if (error) throw new Error("Não foi possível excluir a conta agora. Tente de novo.");
    await supabase().auth.signOut();
  },

  async signOut(): Promise<void> {
    await supabase().auth.signOut();
  },

  async getCurrentUser(): Promise<AuthUser | null> {
    const { data } = await supabase().auth.getUser();
    return data.user ? { id: data.user.id, email: data.user.email ?? "" } : null;
  },

  onChange(callback: () => void): () => void {
    const { data } = supabase().auth.onAuthStateChange((event) => {
      // Renovação de token não muda quem está logado. O setTimeout tira o
      // callback de dentro do listener (a Supabase recomenda não chamar a API ali).
      if (event !== "TOKEN_REFRESHED") setTimeout(callback, 0);
    });
    return () => data.subscription.unsubscribe();
  },
};
