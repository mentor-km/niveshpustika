# Product Roadmap

Planned improvements for Nivesh Pustika, grouped by priority.

---

## P0 — Reliability & polish

| Item | Status | Notes |
|------|--------|-------|
| Cross-platform PWA UX | Done | Safe-area, bottom sheet dialog, OTP resend |
| Symbol autocomplete in dialog | Done | Portal + Radix guard |
| Profile bootstrap on session restore | Done | `ensureProfile` on load |
| Admin config unified | Done | Client + SQL aligned |
| CI build on push | Done | `build.yml` |
| Manifest icons (192 + maskable) | Planned | Better Android install UX |
| SW update toast | Planned | Notify users of new version |

---

## P1 — Core journal features

| Feature | Description |
|---------|-------------|
| **Trade notes** | Free-text field per trade (setup, mistakes, lessons) |
| **Fees / charges** | Brokerage, STT, net P&L after costs |
| **CSV export** | Download trades for tax / audit |
| **Breakeven + R:R on dashboard** | Already computed in `tradeStats.js` — surface in UI |
| **Smarter empty states** | Distinguish “no trades” vs “no trades in segment filter” |
| **Profile labels** | Separate Email vs Mobile display for Google vs phone users |

---

## P2 — Trader workflow

| Feature | Description |
|---------|-------------|
| **Tags / strategies** | Filter dashboard by setup (ORB, breakout, swing) |
| **Calendar heatmap** | Daily P&L view |
| **Kite CSV import** | Upload broker export → parse into trades |
| **Multi-account** | Separate journals per account |
| **Trade duplication** | “Log similar trade” from existing row |
| **Pagination** | Trades list for heavy users |

---

## P3 — Growth & retention

| Feature | Description |
|---------|-------------|
| **Onboarding tour** | First-login walkthrough: log one sample trade |
| **Weekly email digest** | P&L summary via Supabase Edge Function + Resend |
| **PWA push reminders** | “Log today’s trades” notification |
| **Referral link** | Share with other traders |
| **Instrument sync health** | “Symbols updated 2h ago” badge in app |

---

## P4 — Advanced / long-term

| Feature | Description |
|---------|-------------|
| **Kite API auto-import** | OAuth + fetch trades from broker |
| **Options analytics** | Expiry-wise P&L, Greeks (if data available) |
| **Offline draft queue** | IndexedDB → sync when online |
| **Paid tiers** | If monetization added later |
| **Native wrapper** | TWA / Capacitor if Play Store needed |

---

## Technical debt

| Item | Notes |
|------|-------|
| Error boundary + router errorElement | Graceful crash UI |
| Startup env validation screen | Block app if Supabase keys missing |
| Admin pagination | Scale beyond in-memory user list |
| Consolidate segment buckets in stats | Align with `TRADE_SEGMENTS` |
| ESLint config fix | Pre-existing `AudioWorkletGlobalScope` issue |

---

## How to prioritize

1. **P0** — anything blocking mobile users or production stability
2. **P1** — highest trader value per effort (notes, export, fees)
3. **P2** — power users and import workflows
4. **P3+** — growth once core journal is sticky

Update this file when items ship or priorities change.
