/**
 * Só aceita caminhos internos no ?redirect= (evita mandar o usuário para outro site).
 * O navegador trata "\" como "/", então "/\site.com" também é bloqueado.
 */
export function safeRedirect(value: string | null): string {
  if (!value || !value.startsWith("/") || value.startsWith("//") || /[\\\s]/.test(value)) return "/";
  return value;
}
