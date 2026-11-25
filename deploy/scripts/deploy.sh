#!/usr/bin/env bash
# deploy.sh — déploiement/rollback du frontend (lexfront) sur le VPS.
# Usage : deploy.sh <vX.Y.Z>
set -euo pipefail

APP_DIR="${APP_DIR:-/opt/lexfront}"
COMPOSE_FILE="docker-compose.prod.yml"
IMAGES_ENV="$APP_DIR/.images.env"
HEALTH_TIMEOUT="${HEALTH_TIMEOUT:-120}"

tag="${1:-}"
[[ "$tag" =~ ^v[0-9]+\.[0-9]+\.[0-9]+$ ]] || { echo "Tag invalide : '$tag' (attendu vX.Y.Z)" >&2; exit 2; }

cd "$APP_DIR"
[[ -f "$IMAGES_ENV" ]] || { echo "$IMAGES_ENV absent : copier deploy/images.env.example vers $IMAGES_ENV" >&2; exit 1; }

if [[ -d .git ]]; then
  git pull --ff-only origin main || echo "⚠️ git pull ignoré (vérifier la clé de lecture)"
fi

dc() { docker compose -f "$COMPOSE_FILE" --env-file "$IMAGES_ENV" "$@"; }

if [[ -n "${GHCR_USER:-}" && ! -t 0 ]]; then
  IFS= read -r token_in || true
  if [[ -n "${token_in:-}" ]]; then
    printf '%s' "$token_in" | docker login ghcr.io -u "$GHCR_USER" --password-stdin >/dev/null
  fi
fi

current="$(grep -E '^LEXFRONT_IMAGE=' "$IMAGES_ENV" | cut -d= -f2-)"
[[ -n "$current" ]] || { echo "LEXFRONT_IMAGE absent de $IMAGES_ENV" >&2; exit 1; }
new="${current%:*}:${tag}"
echo ">> LEXFRONT_IMAGE : $current -> $new"

set_image() {
  local tmp; tmp="$(mktemp)"
  grep -v -E '^LEXFRONT_IMAGE=' "$IMAGES_ENV" > "$tmp" || true
  printf 'LEXFRONT_IMAGE=%s\n' "$1" >> "$tmp"
  cat "$tmp" > "$IMAGES_ENV"; rm -f "$tmp"
}

wait_healthy() {
  local cid deadline=$((SECONDS + HEALTH_TIMEOUT)) status
  cid="$(dc ps -q lexfront)"
  [[ -n "$cid" ]] || return 1
  while (( SECONDS < deadline )); do
    status="$(docker inspect -f '{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}' "$cid" 2>/dev/null || echo unknown)"
    [[ "$status" == "healthy" || "$status" == "running" ]] && return 0
    sleep 3
  done
  return 1
}

set_image "$new"
dc pull lexfront
dc up -d --no-deps lexfront

if wait_healthy; then
  echo ">> OK : lexfront sain avec $new"
  docker image prune -f >/dev/null 2>&1 || true
else
  echo ">> ÉCHEC de santé, rollback vers $current" >&2
  set_image "$current"
  dc up -d --no-deps lexfront || true
  exit 1
fi
