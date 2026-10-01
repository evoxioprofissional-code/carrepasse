"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

// Cloudflare Turnstile (captcha sem "clique nos semáforos"). Só aparece quando
// NEXT_PUBLIC_TURNSTILE_SITE_KEY existe; a verificação é feita pela Supabase
// (Auth > Attack Protection > Captcha, com a chave secreta da Cloudflare).
export const CAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";
export const captchaEnabled = CAPTCHA_SITE_KEY !== "";

interface TurnstileApi {
  render(element: HTMLElement, options: Record<string, unknown>): string;
  remove(widgetId: string): void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

interface CaptchaProps {
  onToken: (token: string | null) => void;
}

/** Para pedir um token novo (ele vale uma vez), recrie o componente mudando a `key`. */
export function Captcha({ onToken }: CaptchaProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const onTokenRef = useRef(onToken);
  const [ready, setReady] = useState(() => typeof window !== "undefined" && Boolean(window.turnstile));

  useEffect(() => {
    onTokenRef.current = onToken;
  }, [onToken]);

  useEffect(() => {
    if (!captchaEnabled || !ready || !containerRef.current || !window.turnstile) return;
    const id = window.turnstile.render(containerRef.current, {
      sitekey: CAPTCHA_SITE_KEY,
      language: "pt-br",
      theme: "light",
      callback: (token: string) => onTokenRef.current(token),
      "expired-callback": () => onTokenRef.current(null),
      "error-callback": () => onTokenRef.current(null),
    });
    return () => window.turnstile?.remove(id);
  }, [ready]);

  if (!captchaEnabled) return null;

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onReady={() => setReady(true)}
      />
      <div ref={containerRef} className="min-h-[65px]" aria-label="Verificação de segurança" />
    </>
  );
}
