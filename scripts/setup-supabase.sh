#!/bin/bash
# ============================================================
# Leo Club of Pokhara — Supabase Complete Setup
# ============================================================
# This script connects your project to Supabase in 3 steps.
# Run it with: bash scripts/setup-supabase.sh
# ============================================================

set -e

echo ""
echo "🦁  Leo Club of Pokhara — Supabase Setup"
echo "=========================================="
echo ""
echo "This script connects your project to Supabase PostgreSQL."
echo ""
echo "📋  PREREQUISITES:"
echo "   1. A Supabase account (free at https://supabase.com)"
echo "   2. A Supabase project already created"
echo ""
echo "📋  STEP 1: Create database tables"
echo "   1. Go to https://supabase.com → Your Project → SQL Editor"
echo "   2. Click 'New Query'"
echo "   3. Open the file: scripts/supabase-migration.sql"
echo "   4. Copy ALL the contents and paste into the SQL editor"
echo "   5. Click 'Run' — this creates all 21 tables + indexes + RLS policies"
echo ""
echo "   ✅  Done? Press Enter to continue..."
read

echo ""
echo "📋  STEP 2: Get your connection string"
echo "   1. Go to Settings → Database"
echo "   2. Under 'Connection string', select 'URI'"
echo "   3. Choose 'Transaction pooler' (port 6543)"
echo "   4. Copy the connection string"
echo "   5. Replace [YOUR-PASSWORD] with your database password"
echo ""
echo "   It looks like:"
echo "   postgresql://postgres.pbvxnimctxwmpxlqkcsm:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres"
echo ""

read -p "🔗  Paste your connection string: " CONN_STRING

if [ -z "$CONN_STRING" ]; then
  echo "❌  No connection string provided. Exiting."
  exit 1
fi

echo ""
echo "✅  Connection string received."

# ─── Update .env ───────────────────────────────────────────
echo ""
echo "📋  STEP 3: Updating .env file..."

ENV_FILE=".env"

if [ -f "$ENV_FILE" ]; then
  sed -i '/^DATABASE_URL=/d' "$ENV_FILE"
else
  touch "$ENV_FILE"
fi

# Add DATABASE_URL at the top
echo "DATABASE_URL=\"$CONN_STRING\"" > "$ENV_FILE.tmp"
echo "" >> "$ENV_FILE.tmp"
cat "$ENV_FILE" >> "$ENV_FILE.tmp"
mv "$ENV_FILE.tmp" "$ENV_FILE"

echo "✅  .env updated."

# ─── Install dependencies ──────────────────────────────────
echo ""
echo "📋  Installing dependencies..."
bun install 2>&1 | tail -3
echo "✅  Dependencies installed."

# ─── Generate Prisma client ────────────────────────────────
echo ""
echo "📋  Generating Prisma client..."
bun run db:generate 2>&1 | tail -3
echo "✅  Prisma client generated."

# ─── Seed with real data ───────────────────────────────────
echo ""
echo "📋  Seeding database with real Leo Club data..."
bun run scripts/seed-real-data.ts 2>&1 | tail -15
echo ""
echo "✅  Database seeded."

# ─── Done ──────────────────────────────────────────────────
echo ""
echo "=========================================="
echo "🎉  Supabase setup complete!"
echo "=========================================="
echo ""
echo "Your project is now fully connected to Supabase."
echo ""
echo "🚀  Next steps:"
echo "   • Run: bun run dev"
echo "   • Public site: http://localhost:3000"
echo "   • Admin CMS:   http://localhost:3000/?admin=1"
echo ""
echo "📝  Admin login:"
echo "   admin@leo.club / admin123"
echo ""
