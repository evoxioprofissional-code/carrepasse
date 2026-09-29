import { supabase } from "@/lib/supabase/client";
import type { SellerType } from "@/types/user";

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
  async signUp(input: SignUpInput): Promise<void> {
    const { error } = await supabase().auth.signUp({
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
  },

  async signIn(email: string, password: string): Promise<void> {
    const { error } = await supabase().auth.signInWithPassword({ email: email.trim().toLowerCase(), password });
    if (error) throw new Error(translateAuthError(error.message));
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
