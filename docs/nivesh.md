# Nivesh Pustika — Technical Overview

**Product:** Indian trading journal (web + installable PWA)  
**Live:** [https://niveshpustika.in](https://niveshpustika.in)  
**Repo:** [github.com/gajveenastores-dotcom/niveshpustika](https://github.com/gajveenastores-dotcom/niveshpustika)

Nivesh Pustika lets Indian market traders log closed trades, track P&L in ₹, and review performance analytics on desktop or mobile — without a native app store install.

---

## Tech stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, Vite 4, React Router 6 |
| **Styling** | Tailwind CSS 3, Radix UI primitives, Lucide icons |
| **Forms & validation** | React Hook Form, Zod |
| **Data fetching** | TanStack React Query |
| **Charts** | Recharts |
| **Animations** | GSAP (landing), Framer Motion (dashboard) |
| **Backend / auth** | Supabase (PostgreSQL, Auth, Row Level Security) |
| **Hosting** | Vercel (SPA rewrites) |
| **PWA** | vite-plugin-pwa, Workbox, `public/manifest.json` |
| **CI** | GitHub Actions (build + daily instrument sync) |
| **Instrument data** | Zerodha Kite instruments CSV → Supabase REST upsert |

---

## Architecture

```
Browser / PWA
    │
    ├── React SPA (Vite build → Vercel)
    │     ├── Public: Landing, Privacy, Terms
    │     ├── Auth: /app (phone OTP + Google OAuth)
    │     └── Protected: Dashboard, Trades, Profile
    │
    └── Supabase
          ├── auth.users (phone + Google)
          ├── public.profiles
          ├── public.trades
          └── public.instruments (~98k rows, synced daily)
```

**Auth flow:** Supabase session in browser storage → `AuthProvider` bootstraps profile on load → `ProtectedRoute` / `AdminRoute` gate pages.

**Admin:** Client checks `VITE_ADMIN_EMAIL` / `VITE_ADMIN_PHONE`; database uses `public.is_admin()` for RLS (must match env vars).

---

## Routes

| Path | Access | Purpose |
|------|--------|---------|
| `/` | Public | Marketing landing (cinematic hero) |
| `/app` | Public | Sign in (OTP + Google) |
| `/dashboard` | Auth | Performance analytics |
| `/trades` | Auth | Trade list, filter, edit, delete |
| `/profile` | Auth | Name, account info, logout |
| `/admin` | Admin | User stats, per-user trade view |
| `/privacy`, `/terms` | Public | Legal pages |

**PWA:** `start_url` is `/app`. Installed app opening `/` redirects to `/app` or `/dashboard` if already logged in.

---

## Core modules

### `src/lib/supabase.js`
- Supabase client, auth helpers (OTP, Google, sign out)
- Trade CRUD, profile CRUD, admin aggregates
- P&L calculation (`calculatePnL`, `effectiveQuantity` for equity vs F&O lot sizing)
- Trade segments: Equity, Futures, Options, Currency, Commodities

### `src/lib/tradeStats.js`
- Win rate, profit factor, avg win/loss, equity curve
- Segment breakdown, monthly summary, top winners/losers

### `src/lib/instruments.js`
- Symbol search against Supabase `instruments` table
- Token parsing (e.g. “NIFTY CE”, “GOLD FUT”)
- MCX/CDS lot-size correction (Kite CSV often reports `1`)

### `src/components/TradeApp/`
- **AppLayout** — sidebar (desktop), bottom nav + FAB (mobile)
- **TradeForm** — log/edit trade with Zod validation (exit date ≥ entry date)
- **SymbolSearch** — autocomplete with portal dropdown (dialog-safe), manual symbol fallback
- **TradeList** — segment filter, edit/delete dialogs

### `tools/sync-kite-instruments.mjs`
- Downloads Kite instrument master CSV
- Filters NSE, NFO, BFO, CDS, MCX
- Upserts via Supabase REST (no WebSocket — CI-safe)
- Runs daily 6:00 AM IST via GitHub Actions

---

## Database (Supabase)

### Tables
- **profiles** — `id` (FK auth.users), name, email, last_active, status
- **trades** — segment, symbol, prices, quantity/lots, direction, entry/exit times, pnl
- **instruments** — tradingsymbol, exchange, lot_size, expiry, strike, etc.

### Security
- RLS: users read/write own trades and profile
- Admin SELECT on all profiles/trades via `is_admin()`
- Instruments: authenticated read only

### Migrations (run in SQL Editor as needed)
| File | Purpose |
|------|---------|
| `supabase/schema.sql` | Full setup (fresh project) |
| `supabase/fix-admin-email.sql` | Update admin email/phone in `is_admin()` |
| `supabase/fix-phone-profile.sql` | Phone signup trigger + profile backfill |
| `supabase/instruments.sql` | Instruments table + RLS |
| `supabase/add-trade-lots.sql` | lot_size / lots columns |

---

## Environment variables

| Variable | Where | Purpose |
|----------|-------|---------|
| `VITE_SUPABASE_URL` | Vercel, `.env.local` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Vercel, `.env.local` | Public anon key |
| `VITE_ADMIN_EMAIL` | Vercel, `.env.local` | Admin UI access (Google) |
| `VITE_ADMIN_PHONE` | Vercel, `.env.local` | Admin UI access (OTP) |
| `SUPABASE_SERVICE_ROLE_KEY` | GitHub Secrets, local only | Instrument sync script |

**Current admin email:** `mentor@analystbychance.com` (must match `public.is_admin()` in Supabase)

---

## PWA & mobile

- Service worker: auto-update via Workbox
- iOS: `apple-mobile-web-app-*` meta tags, safe-area CSS
- Android: install banner on login with menu instructions
- Mobile UX: bottom sheet trade dialog, keyboard scroll-into-view, `visualViewport` for symbol dropdown
- Symbol dropdown portaled to `document.body` with Radix dialog outside-click guard

---

## CI / deployment

| Workflow | Trigger | Action |
|----------|---------|--------|
| `.github/workflows/build.yml` | Push/PR to `main` | `npm ci` + `npm run build` |
| `.github/workflows/sync-instruments.yml` | Daily cron + manual | Sync Kite instruments |

Vercel auto-deploys on push to `main`.

---

## Scripts

```bash
npm run dev              # Local dev (port 3000)
npm run build            # Production build
npm run preview          # Preview production build
npm run sync-instruments # Manual instrument sync (needs service role key)
```

---

## Design system

- **Primary:** Teal `#2d8b8b`
- **Accent:** Coral `#f0544f` (landing gradients)
- **Fonts:** Inter (body), Poppins (headings)
- **Currency:** INR via `Intl.NumberFormat('en-IN')`

---

## Key decisions

1. **Journal, not live trading** — users log closed trades manually; no broker order placement.
2. **Supabase over custom API** — auth, DB, and RLS in one place; client talks directly with anon key.
3. **Kite instruments** — free daily symbol master for Indian market autocomplete.
4. **PWA over native app** — single codebase for web + home-screen install; no Play Store dependency.
5. **Manual symbol entry** — trades can be logged even if sync fails or symbol is missing from DB.

---

## Repository layout

```
src/
├── pages/           # Route pages
├── components/
│   ├── Landing/     # Marketing + legal layout
│   ├── TradeApp/    # Journal UI (form, list, layout, search)
│   └── ui/          # shadcn-style primitives
├── hooks/           # useAuth
├── lib/             # supabase, tradeStats, instruments, pwa
└── main.jsx         # Router + providers

supabase/            # SQL migrations (see DATA-MODEL.md)
tools/               # sync-kite-instruments.mjs
.github/workflows/   # build + sync
public/              # manifest, logo, static assets
docs/                # All project documentation
```

---

## Related docs

See **[README.md](./README.md)** for the full index.

- [Journey.md](./Journey.md) — user flows and features
- [ONBOARDING.md](./ONBOARDING.md) — local dev setup
- [OPERATIONS.md](./OPERATIONS.md) — deploy and migrations
- [AUTH-SETUP-GUIDE.md](./AUTH-SETUP-GUIDE.md) — Supabase auth configuration
