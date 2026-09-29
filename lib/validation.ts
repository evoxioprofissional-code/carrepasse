import { z } from "zod";

const phone = z
  .string()
  .transform((value) => value.replace(/\D/g, ""))
  .refine((digits) => /^[1-9]{2}9?[0-9]{8}$/.test(digits), "Digite o WhatsApp com DDD, ex.: (81) 99999-8888.");

const sellerType = z.enum(["lojista", "corretor", "particular"], { message: "Escolha como você vai usar o Car Repasse." });

/** Campos de perfil comuns ao cadastro e à edição. */
const profileFields = {
  name: z.string().trim().min(2, "Digite seu nome.").max(80, "Nome muito longo."),
  phone,
  sellerType,
  storeName: z.string().trim().max(80, "Nome da loja muito longo.").optional(),
  city: z.string().trim().min(2, "Digite sua cidade."),
  state: z.string().length(2, "Escolha o estado."),
};

function requireStoreForLojista<T extends { sellerType: string; storeName?: string }>(data: T, ctx: z.RefinementCtx) {
  if (data.sellerType === "lojista" && (!data.storeName || data.storeName.length < 2)) {
    ctx.addIssue({ code: "custom", path: ["storeName"], message: "Lojista precisa informar o nome da loja." });
  }
}

export const signUpSchema = z
  .object({
    ...profileFields,
    email: z.string().trim().email("Digite um e-mail válido."),
    password: z.string().min(8, "A senha precisa ter pelo menos 8 caracteres."),
    acceptTerms: z.literal(true, { message: "Você precisa aceitar os termos para criar a conta." }),
  })
  .superRefine(requireStoreForLojista);

export const profileSchema = z.object(profileFields).superRefine(requireStoreForLojista);

export const signInSchema = z.object({
  email: z.string().trim().email("Digite um e-mail válido."),
  password: z.string().min(1, "Digite sua senha."),
});

export type SignUpValues = z.input<typeof signUpSchema>;
export type SignUpData = z.output<typeof signUpSchema>;
export type ProfileValues = z.input<typeof profileSchema>;
export type ProfileData = z.output<typeof profileSchema>;
export type SignInValues = z.infer<typeof signInSchema>;
