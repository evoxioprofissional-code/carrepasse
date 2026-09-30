import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  const base = siteUrl().origin;
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/minha-conta", "/anunciar", "/entrar", "/cadastro", "/esqueci-senha", "/redefinir-senha", "/auth", "/admin", "/dev"] }],
    sitemap: `${base}/sitemap.xml`,
  };
}
