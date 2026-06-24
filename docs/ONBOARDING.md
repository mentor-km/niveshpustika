# Developer Onboarding

Get Nivesh Pustika running locally in about 10 minutes.

## Prerequisites

- **Node.js 22+** (matches CI and instrument sync)
- **npm**
- A **Supabase** project with schema applied (see [OPERATIONS.md](./OPERATIONS.md))
- Git

## 1. Clone and install

```bash
git clone https://github.com/gajveenastores-dotcom/niveshpustika.git
cd niveshpustika
npm ci
```

## 2. Environment

Copy the example env file:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_ADMIN_EMAIL=mentor@analystbychance.com
VITE_ADMIN_PHONE=+918109901136

# Optional — only for local instrument sync:
# SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

Get keys from **Supabase → Project Settings → API**.

## 3. Run dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

- Landing: `/`
- Login: `/app`
- After sign-in: `/dashboard`

## 4. Verify build

```bash
npm run build
```

This is the same check GitHub Actions runs on every push to `main`.

## 5. Optional — symbol autocomplete

Without the `instruments` table populated, symbol search still works via **manual entry**.

To enable autocomplete locally:

1. Run `supabase/instruments.sql` in Supabase SQL Editor (if not done)
2. Add `SUPABASE_SERVICE_ROLE_KEY` to `.env.local`
3. Run `npm run sync-instruments` (1–2 min first run)

See [instruments-setup.md](./instruments-setup.md).

## Project structure

```
src/pages/          Route pages
src/components/     UI (Landing, TradeApp, ui/)
src/lib/            supabase, tradeStats, instruments
src/hooks/          useAuth
supabase/           SQL migrations (not markdown)
tools/              sync-kite-instruments.mjs
docs/               You are here
```

## Useful commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Dev server port 3000 |
| `npm run build` | Production build |
| `npm run preview` | Preview build |
| `npm run sync-instruments` | Sync Kite CSV to Supabase |

## Next reads

- [nivesh.md](./nivesh.md) — architecture overview
- [DATA-MODEL.md](./DATA-MODEL.md) — database schema
- [AUTH-SETUP-GUIDE.md](./AUTH-SETUP-GUIDE.md) — if setting up auth from scratch
