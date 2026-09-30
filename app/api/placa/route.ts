import { NextResponse, type NextRequest } from "next/server";
import { isValidPlate, normalizePlate } from "@/lib/plate";
import { createRouteClient } from "@/lib/supabase/server";
import { PlateProviderError, apiPlacasLookup } from "@/services/apiPlacas";
import { mockPlateLookup } from "@/services/plateMock";
import type { PlateLookupResult } from "@/types/fipe";

// Consulta de placa pelo servidor: o token da API nunca vai para o navegador.
// Só para quem está logado, com cache por usuário e limite diário de
// consultas pagas (tabela plate_lookups, migração 0009).

const DAILY_LIMIT = 10;
const CACHE_DAYS = 180;
const DAY = 24 * 60 * 60 * 1000;

function fail(status: number, message: string) {
  return NextResponse.json({ message }, { status });
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => ({}))) as { plate?: unknown };
  const plate = normalizePlate(typeof body.plate === "string" ? body.plate : "");
  if (!isValidPlate(plate)) return fail(400, "Placa inválida. Use o formato ABC1D23 (Mercosul) ou ABC-1234.");

  const supabase = await createRouteClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return fail(401, "Entre na sua conta para consultar a placa.");

  const token = process.env.API_PLACAS_TOKEN;
  // Sem token (desenvolvimento ou antes de contratar): simulação, sem custo.
  if (!token) {
    const simulated = await mockPlateLookup(plate);
    return simulated ? NextResponse.json(simulated) : fail(404, "Não encontramos essa placa. Confira os caracteres ou preencha pela tabela FIPE.");
  }

  // 1) Cache: a mesma pessoa consultando a mesma placa não paga de novo.
  const { data: cached } = await supabase
    .from("plate_lookups")
    .select("result, fetched_at")
    .eq("user_id", user.id)
    .eq("plate", plate)
    .maybeSingle();
  if (cached && Date.now() - new Date(cached.fetched_at).getTime() < CACHE_DAYS * DAY) {
    return NextResponse.json(cached.result as PlateLookupResult);
  }

  // 2) Limite diário de consultas pagas.
  const { count } = await supabase
    .from("plate_lookups")
    .select("plate", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("fetched_at", new Date(Date.now() - DAY).toISOString());
  if ((count ?? 0) >= DAILY_LIMIT) {
    return fail(429, "Você atingiu o limite de consultas de placa por hoje. Preencha pela tabela FIPE ou tente amanhã.");
  }

  // 3) Consulta paga.
  try {
    const result = await apiPlacasLookup(plate, token);
    if (!result) return fail(404, "Não encontramos essa placa. Confira os caracteres ou preencha pela tabela FIPE.");
    await supabase
      .from("plate_lookups")
      .upsert({ user_id: user.id, plate, result, provider: "apiplacas" }, { onConflict: "user_id,plate" });
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof PlateProviderError && error.configuration) console.error("[api/placa]", error.message);
    return fail(503, "A consulta de placa está fora do ar agora. Preencha pela tabela FIPE.");
  }
}
