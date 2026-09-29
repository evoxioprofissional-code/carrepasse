/** Só aceita caminhos internos no ?redirect= (evita mandar o usuário para outro site). */
export function safeRedirect(value: string | null): string {
  return value && value.startsWith("/") && !value.startsWith("//") ? value : "/";
}
