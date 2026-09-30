import { NextResponse, type NextRequest } from "next/server";
import { safeRedirect } from "@/lib/redirect";
import { readSession } from "@/lib/supabase/session";

const PROTECTED_PREFIXES = ["/anunciar", "/minha-conta", "/admin"];
const AUTH_PAGES = ["/entrar", "/cadastro"];


export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const { response, userId } = await readSession(request);

  const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
  if (isProtected && !userId) {
    const login = new URL("/entrar", request.url);
    login.searchParams.set("redirect", `${pathname}${search}`);
    return NextResponse.redirect(login);
  }

  if (AUTH_PAGES.includes(pathname) && userId) {
    return NextResponse.redirect(new URL(safeRedirect(request.nextUrl.searchParams.get("redirect")), request.url));
  }

  return response;
}

// Só nas páginas que dependem de login: o resto do site continua estático.
export const config = {
  matcher: ["/anunciar/:path*", "/minha-conta/:path*", "/admin/:path*", "/entrar", "/cadastro"],
};
