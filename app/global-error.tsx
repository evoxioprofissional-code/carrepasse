"use client";

// Último recurso: erro no próprio layout. Não carrega o CSS do site, então
// o visual é todo inline (cores da marca).
export default function GlobalError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <html lang="pt-BR">
      <body style={{ margin: 0, minHeight: "100dvh", display: "grid", placeItems: "center", background: "#0F1113", color: "#FFFFFF", fontFamily: "system-ui, sans-serif", padding: 16 }}>
        <title>Car Repasse — instabilidade</title>
        <main style={{ maxWidth: 420, textAlign: "center" }}>
          <p style={{ color: "#7ED321", fontWeight: 800, letterSpacing: 1, margin: 0 }}>CAR REPASSE</p>
          <h1 style={{ fontSize: 26, margin: "12px 0 8px" }}>O site está com uma instabilidade</h1>
          <p style={{ color: "rgba(255,255,255,0.75)", lineHeight: 1.5, margin: "0 0 24px" }}>
            Já estamos de olho. Tente de novo em alguns segundos.
          </p>
          <button
            type="button"
            onClick={() => retry()}
            style={{ background: "#7ED321", color: "#15171A", border: 0, borderRadius: 8, padding: "12px 24px", fontSize: 16, fontWeight: 700, cursor: "pointer", minHeight: 44 }}
          >
            Tentar de novo
          </button>
        </main>
      </body>
    </html>
  );
}
