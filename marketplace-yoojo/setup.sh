#!/usr/bin/env bash
# =============================================================
# setup.sh - One-command developer onboarding for ServiceHub
# Usage:  bash setup.sh
# =============================================================
set -euo pipefail

GREEN="\033[0;32m"; YELLOW="\033[1;33m"; RED="\033[0;31m"; NC="\033[0m"
info()    { echo -e "${GREEN}[setup]${NC} $*"; }
warn()    { echo -e "${YELLOW}[warn] ${NC} $*"; }
error()   { echo -e "${RED}[error]${NC} $*" >&2; }

# --- Prerequisites --------------------------------------------------
command -v node  >/dev/null 2>&1 || { error "Node.js is not installed (need 18+)."; exit 1; }
command -v npm   >/dev/null 2>&1 || { error "npm is not installed."; exit 1; }

NODE_VERSION=$(node -e "process.stdout.write(process.versions.node.split('.')[0])")
if [ "$NODE_VERSION" -lt 18 ]; then
  error "Node.js 18+ is required (found v$(node -v))."
  exit 1
fi

# --- .env -----------------------------------------------------------
if [ ! -f .env ]; then
  if [ -f .env.example ]; then
    cp .env.example .env
    info "Created .env from .env.example - please review and update the values."
  else
    warn ".env.example not found; skipping .env creation."
  fi
else
  info ".env already exists - skipping."
fi

# --- Dependencies ---------------------------------------------------
info "Installing npm dependencies..."
npm ci --frozen-lockfile

# --- Prisma client --------------------------------------------------
info "Generating Prisma client..."
npx prisma generate

# --- Database (optional, skip if DATABASE_URL not set) --------------
DB_URL="${DATABASE_URL:-}"
if [ -z "$DB_URL" ] && [ -f .env ]; then
  DB_URL=$(grep -E '^DATABASE_URL=' .env | head -1 | cut -d= -f2- | tr -d '"')
fi

if [ -n "$DB_URL" ] && [ "$DB_URL" != "postgresql://postgres:password@localhost:5432/marketplace_dev" ]; then
  info "Running database migrations..."
  npx prisma migrate deploy 2>/dev/null || \
    npx prisma db push --accept-data-loss 2>/dev/null || \
    warn "DB migration failed - set DATABASE_URL in .env and re-run."

  if npx prisma db execute --stdin <<< "SELECT 1" >/dev/null 2>&1; then
    info "Seeding database..."
    npm run db:seed 2>/dev/null || warn "Seed failed - you can run it manually: npm run db:seed"
  fi
else
  warn "DATABASE_URL not configured - skipping DB setup."
  warn "Update .env and run:  npm run db:push && npm run db:seed"
fi

info ""
info "Setup complete! Start the dev server with:  npm run dev"
info "   Then open http://localhost:3000"
