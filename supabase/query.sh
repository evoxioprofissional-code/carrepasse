#!/bin/sh
# Roda SQL no banco do carrepasse pela Management API da Supabase.
# O token é injetado pelo ambiente (nunca fica no repositório).
# Uso: ./supabase/query.sh "select count(*) from public.listings"
#      ./supabase/query.sh -f supabase/migrations/0004_security_hardening.sql
set -eu

PROJECT_REF="xpsklsfvbvzxsibesylf"

if [ "${1:-}" = "-f" ]; then
  SQL=$(cat "$2")
else
  SQL="$1"
fi

python3 -c 'import json,sys; print(json.dumps({"query": sys.argv[1]}))' "$SQL" |
  curl -sS -m 120 -X POST "https://api.supabase.com/v1/projects/$PROJECT_REF/database/query" \
    -H "Content-Type: application/json" --data-binary @-
echo
