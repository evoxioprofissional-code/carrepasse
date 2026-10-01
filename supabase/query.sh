#!/bin/sh
# Roda SQL no banco do carrepasse pela Management API da Supabase.
# Na nuvem do Claude Code o token é injetado pelo ambiente. No computador, defina
# SUPABASE_ACCESS_TOKEN (token pessoal: supabase.com/dashboard/account/tokens) no
# terminal ou numa linha do .env.local. O token nunca vai para o repositório.
# Uso: sh supabase/query.sh "select count(*) from public.listings"
#      sh supabase/query.sh -f supabase/migrations/0004_security_hardening.sql
set -eu

PROJECT_REF="xpsklsfvbvzxsibesylf"

if [ -z "${SUPABASE_ACCESS_TOKEN:-}" ] && [ -f .env.local ]; then
  SUPABASE_ACCESS_TOKEN=$(grep '^SUPABASE_ACCESS_TOKEN=' .env.local | tail -n 1 | cut -d= -f2- | tr -d "\"' \r")
fi
AUTH_HEADER=""
if [ -n "${SUPABASE_ACCESS_TOKEN:-}" ]; then
  AUTH_HEADER="Authorization: Bearer $SUPABASE_ACCESS_TOKEN"
fi

if [ "${1:-}" = "-f" ]; then
  SQL=$(cat "$2")
else
  SQL="$1"
fi

# JSON pelo Node (já instalado para o projeto), lendo o SQL da entrada padrão.
printf '%s' "$SQL" |
  node -e 'let s = ""; process.stdin.on("data", (d) => (s += d)).on("end", () => process.stdout.write(JSON.stringify({ query: s })))' |
  curl -sS -m 120 -X POST "https://api.supabase.com/v1/projects/$PROJECT_REF/database/query" \
    -H "Content-Type: application/json" ${AUTH_HEADER:+-H "$AUTH_HEADER"} --data-binary @-
echo
