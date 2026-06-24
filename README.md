# Nivesh Pustika

Indian trading journal — log trades, track P&L in ₹, analytics on web and mobile PWA.

**Live:** [niveshpustika.in](https://niveshpustika.in)

## Quick start

```bash
npm ci
cp .env.example .env.local   # add Supabase keys
npm run dev
```

## Documentation

All docs are in **[docs/](./docs/README.md)**:

| Doc | Description |
|-----|-------------|
| [nivesh.md](./docs/nivesh.md) | Tech stack & architecture |
| [Journey.md](./docs/Journey.md) | User journey & features |
| [ONBOARDING.md](./docs/ONBOARDING.md) | Developer setup |
| [OPERATIONS.md](./docs/OPERATIONS.md) | Deploy & runbook |

## Scripts

```bash
npm run dev              # Local development
npm run build            # Production build
npm run sync-instruments # Sync Kite symbols (needs service role key)
```
