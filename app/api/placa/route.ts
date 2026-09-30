import { NextResponse, type NextRequest } from "next/server";
import { isValidPlate, normalizePlate } from "@/lib/plate";
import { createRouteClient } from "@/lib/supabase/server";
import { PlateProviderError, apiPlacasLookup, type PlateParseResult } from "@/services/apiPlacas";
import { mockPlateLookup } from "@/services/plateMock";

// Consulta de placa pelo servidor: o token da API nunca vai para o navegador.
// Só para quem está logado, com cache por usuário e limite diário de
// consultas pagas (tabela plate_lookups, migração 0009).

const DAILY_LIMIT = 10;
const NOT_FOUND = "Não encontramos essa placa. Confira os caracteres ou preencha pela tabela FIPE.";
const CACHE_DAYS = 180;
const DAY = 24 * 60 * 60 * 1000;

function fail(status: number, message: string) {
  return NextResponse.json({ message }, { status });
}

function respond(parsed: PlateParseResult) {
  switch (parsed.kind) {
    case "ok":
      return NextResponse.json(parsed.result);
    case "not-car":
      return fail(422, "Essa placa não é de um carro. O Car Repasse aceita só carros e picapes.");
    case "stolen":
      return fail(422, "Esta placa tem registro de roubo ou furto e não pode ser anunciada. Se for um engano, procure o Detran.");
    default:
      return fail(404, NOT_FOUND);
  }
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
    return simulated ? NextResponse.json(simulated) : fail(404, NOT_FOUND);
  }

  // 1) Cache: a mesma pessoa consultando a mesma placa não paga de novo
  //    (inclusive "não encontrada", que também é cobrada pela API).
  const { data: cached } = await supabase
    .from("plate_lookups")
    .select("result, fetched_at")
    .eq("user_id", user.id)
    .eq("plate", plate)
    .maybeSingle();
  if (cached && Date.now() - new Date(cached.fetched_at).getTime() < CACHE_DAYS * DAY) {
    return respond(cached.result as PlateParseResult);
  }

  // 2) Limite diário de consultas pagas (toda consulta paga grava uma linha).
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
    const parsed = await apiPlacasLookup(plate, token);
    await supabase
      .from("plate_lookups")
      .upsert({ user_id: user.id, plate, result: parsed, provider: "apiplacas" }, { onConflict: "user_id,plate" });
    return respond(parsed);
  } catch (error) {
    if (error instanceof PlateProviderError && error.configuration) console.error("[api/placa]", error.message);
    return fail(503, "A consulta de placa está fora do ar agora. Preencha pela tabela FIPE.");
  }
}
