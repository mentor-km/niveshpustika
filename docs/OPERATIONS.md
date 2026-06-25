# Operations Runbook

Day-to-day operations for [niveshpustika.in](https://niveshpustika.in).

---

## Deployment

| Service | Role |
|---------|------|
| **Vercel** | Hosts the React SPA; auto-deploys on push to `main` |
| **Supabase** | PostgreSQL, Auth, RLS |
| **GitHub Actions** | Build check + daily instrument sync |

### Deploy a frontend change

1. Push to `main`
2. Vercel builds and deploys automatically
3. Confirm at [niveshpustika.in](https://niveshpustika.in)
4. PWA users may need a refresh for service worker updates

### Vercel environment variables

Set in **Vercel → Project → Settings → Environment Variables**:

| Variable | Required | Notes |
|----------|----------|-------|
| `VITE_SUPABASE_URL` | Yes | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Yes | Anon/public key |
| `VITE_ADMIN_EMAIL` | Yes | Must match Supabase `is_admin()` |
| `VITE_ADMIN_PHONE` | Optional | Last 10 digits must match SQL |
| `VITE_TURNSTILE_SITE_KEY` | Production OTP | Cloudflare Turnstile site key; omit locally for direct OTP |

Redeploy after changing env vars.

---

## Pre-launch security (dashboard)

Complete these in provider dashboards before heavy traffic or ads.

### Supabase Auth rate limits

**Supabase → Project Settings → Authentication → Rate Limits**

| Limit | Recommended |
|-------|-------------|
| SMS OTP sends (per hour) | 4–6 per phone/IP |
| Sign-in / token refresh | Defaults usually fine |

Also review **Authentication → Providers → Phone** and confirm Twilio is connected.

### Twilio spending controls

**Twilio Console → Billing → Alerts** and **Usage triggers**

1. Set a **daily spending cap** (e.g. ₹500–1000 to start).
2. Enable **email/SMS alerts** at 50%, 80%, and 100% of budget.
3. Monitor **Monitor → Logs → Messaging** for abuse spikes.

Client-side cooldown (60s between sends, 5/hour per number) reduces accidental churn; server limits are the real guardrail.

### Cloudflare Turnstile + OTP Edge Function

Production phone OTP goes through `send-phone-otp` when `VITE_TURNSTILE_SITE_KEY` is set. See [TURNSTILE-SETUP.md](./TURNSTILE-SETUP.md).

### Admin SMS on new signup

Edge Function `notify-new-user` + Database Webhook on `profiles` INSERT. See [NEW-USER-NOTIFY.md](./NEW-USER-NOTIFY.md).

---

## Database migrations

Run in **Supabase → SQL Editor**. SQL files live in `supabase/` (not `docs/`).

| When | File |
|------|------|
| Fresh project | `schema.sql` |
| Change admin email/phone | `fix-admin-email.sql` |
| Phone users missing profiles | `fix-phone-profile.sql` |
| Add instruments table | `instruments.sql` |
| Add lot columns (legacy) | `add-trade-lots.sql` |

**Rule:** `VITE_ADMIN_EMAIL` and `VITE_ADMIN_PHONE` (client) must match `public.is_admin()` (database).

Current admin email: `mentor@analystbychance.com`

---

## Instrument sync

### Automatic (production)

- Workflow: `.github/workflows/sync-instruments.yml`
- Schedule: **6:00 AM IST** daily (00:30 UTC)
- Manual: GitHub → Actions → Sync Kite instruments → Run workflow

**GitHub Secrets required:**

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

### Manual (local)

```bash
# .env.local needs VITE_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY
npm run sync-instruments
```

See [instruments-setup.md](./instruments-setup.md).

---

## CI workflows

| Workflow | Trigger | Action |
|----------|---------|--------|
| `build.yml` | Push/PR to `main` | `npm ci` + `npm run build` |
| `sync-instruments.yml` | Cron + manual | Kite CSV → Supabase |

---

## Admin access checklist

1. `VITE_ADMIN_EMAIL=mentor@analystbychance.com` in Vercel
2. `fix-admin-email.sql` applied in Supabase (same email + phone digits)
3. Sign in with that Google account **or** admin phone via OTP
4. Visit `/admin`

If UI loads but data fails: client admin OK, RLS `is_admin()` mismatch — re-run SQL.

---

## Monitoring

| Check | Where |
|-------|-------|
| Frontend deploy | Vercel dashboard |
| Build failures | GitHub Actions → Build |
| Sync failures | GitHub Actions → Sync Kite instruments |
| Auth errors | Supabase → Authentication → Logs |
| DB errors | Supabase → Logs / API |

---

## Rollback

- **Frontend:** Vercel → Deployments → Promote previous deployment
- **Database:** Migrations are manual; keep backups in Supabase before destructive SQL
- **Instruments:** Re-run sync; upserts are idempotent

---

## Related docs

- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
- [DATA-MODEL.md](./DATA-MODEL.md)
- [AUTH-SETUP-GUIDE.md](./AUTH-SETUP-GUIDE.md)
