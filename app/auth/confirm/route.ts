import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { safeRedirect } from "@/lib/redirect";
import { createRouteClient } from "@/lib/supabase/server";

const OTP_TYPES: EmailOtpType[] = ["recovery", "signup", "invite", "magiclink", "email", "email_change"];

/**
 * Destino dos links enviados por e-mail (recuperar senha, confirmar conta).
 * Aceita o link com token_hash (funciona em qualquer navegador, mesmo abrindo
 * no app do Gmail) e o link com code (PKCE, do mesmo navegador).
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const code = searchParams.get("code");
  const next = safeRedirect(searchParams.get("next") ?? (type === "recovery" ? "/redefinir-senha" : "/"));

  const supabase = await createRouteClient();
  let ok = false;
  if (tokenHash && type && OTP_TYPES.includes(type)) {
    ok = !(await supabase.auth.verifyOtp({ type, token_hash: tokenHash })).error;
  } else if (code) {
    ok = !(await supabase.auth.exchangeCodeForSession(code)).error;
  }

  const target = ok ? next : type === "recovery" || next === "/redefinir-senha" ? "/esqueci-senha?link=invalido" : "/entrar";
  return NextResponse.redirect(new URL(target, request.url));
}
