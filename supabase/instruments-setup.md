# Instrument search (Kite CSV)

Symbol autocomplete and lot-size auto-fill use a daily sync from Zerodha’s public instruments file.

## Why daily (not weekly)?

F&O and options **contracts expire every week/month**. Lot sizes can change. A **daily sync before market open** keeps search results accurate. Weekly sync would show expired contracts and wrong lot sizes.

## One-time setup

### 1. Create the table

In **Supabase → SQL Editor**, run:

`supabase/instruments.sql`

### 2. GitHub secrets (for automatic daily sync)

In **GitHub → repo → Settings → Secrets → Actions**, add:

| Secret | Value |
|--------|--------|
| `SUPABASE_URL` | Your project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (Settings → API) |

The workflow `.github/workflows/sync-instruments.yml` runs daily at **6:00 AM IST**.

You can also trigger it manually: **Actions → Sync Kite instruments → Run workflow**.

### 3. First sync (local)

Add to **`.env.local`** (same file as your Vite keys):

```
SUPABASE_SERVICE_ROLE_KEY=eyJ...   # service_role secret — NOT anon key
```

Get it from **Supabase → Project Settings → API → service_role** (click Reveal).

Then run:

```bash
npm run sync-instruments
```

The script reads `VITE_SUPABASE_URL` from `.env.local` automatically.

First run takes 1–2 minutes (~80k+ rows).

## Segments mapped

| App segment | Kite source |
|-------------|-------------|
| Equity | NSE/BSE `EQ` |
| Futures | NFO/BFO/MCX/CDS `FUT` |
| Options | NFO/BFO/MCX/CDS `CE`/`PE` |
| Currency | CDS segment |
| Commodities | MCX |

## Troubleshooting

- **No search results** — Run sync once; confirm `instruments` table has rows in Supabase Table Editor.
- **Sync fails in GitHub Actions** — Check secrets and that `instruments.sql` was applied.
- **Expired contracts in list** — Search filters `expiry >= today` for non-equity; re-run sync if stale.
