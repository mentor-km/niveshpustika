# Changelog

All notable changes to Nivesh Pustika. Format based on [Keep a Changelog](https://keepachangelog.com/).

---

## [Unreleased]

### Added
- Documentation folder (`docs/`) with onboarding, operations, data model, roadmap

---

## 2025-06 — Cross-platform hardening

### Added
- `ensureProfile` + `updateLastActive` on session restore
- iOS PWA meta tags and safe-area CSS
- Mobile bottom-sheet trade dialog with focus scroll-into-view
- OTP resend with 60s cooldown
- OAuth error toast from URL params
- GitHub Actions build workflow
- `visualViewport` listener for symbol dropdown positioning

### Changed
- Admin email unified to `mentor@analystbychance.com` (client + SQL)
- Phone signup trigger merged into `schema.sql`
- PWA `start_url` → `/app`
- Android install instructions on login page

### Fixed
- Symbol dropdown selection blocked by Radix dialog
- Symbol dropdown clipped in trade dialog on mobile (portal)
- Dashboard top winners/losers showing identical lists

---

## 2025-06 — Instrument search & cleanup

### Added
- Kite instrument daily sync (GitHub Actions, ~98k symbols)
- Symbol autocomplete with manual entry fallback
- Token search (“NIFTY CE”, “GOLD FUT”)
- Equity ranking by symbol relevance
- MCX/CDS lot-size corrections
- Trade entry/exit date validation

### Fixed
- Instrument sync CI (REST instead of WebSocket)
- NFO/BFO segment mapping for futures
- Derivative search ordering (nearest expiry first)

### Removed
- ~70 unused files (mock auth pages, legacy marketing, unused UI)

---

## Earlier

### Added
- Phone OTP + Google OAuth
- Dashboard with Recharts (equity curve, segments, monthly)
- Trade CRUD with segment-specific sizing
- Admin panel (users, stats, read-only trades)
- PWA install support
- Cinematic landing page
- Privacy and Terms pages

---

## Versioning note

Production deploys track `main` branch. Vercel assigns deployment IDs; git commit SHA is the source of truth for what is live.
