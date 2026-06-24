# Troubleshooting

Common issues and fixes for Nivesh Pustika.

---

## Auth

### OTP not received

1. Confirm phone auth enabled in Supabase (see [phone-auth-setup.md](./phone-auth-setup.md))
2. Check Supabase Auth logs for SMS errors
3. Verify 10-digit Indian number (no country code in input — app adds +91)
4. Wait 60s and use **Resend OTP**
5. Try Google sign-in as alternative

### Google sign-in fails / redirects with error

1. Check OAuth redirect URLs in Supabase include `https://niveshpustika.in/**`
2. App shows toast if `?error=` in URL after redirect
3. In PWA standalone mode, try browser Safari/Chrome if OAuth flaky

### Logged in but immediately logged out

1. Check browser allows localStorage / cookies
2. Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Vercel
3. iOS Private Browsing can clear sessions aggressively

### First trade fails for phone user (FK error)

1. Run `supabase/fix-phone-profile.sql` in SQL Editor
2. Ensure latest app deployed (`ensureProfile` on session restore)
3. Check `profiles` row exists for user in Table Editor

---

## Admin

### Can open `/admin` but no user data

**Cause:** Client admin OK, database `is_admin()` mismatch.

**Fix:**
1. Set `VITE_ADMIN_EMAIL=mentor@analystbychance.com` in Vercel
2. Run `supabase/fix-admin-email.sql` with same email
3. Redeploy Vercel

### Cannot access `/admin` at all

1. Sign in with admin Google email or admin phone
2. Check `VITE_ADMIN_EMAIL` / `VITE_ADMIN_PHONE` env vars

---

## Symbol autocomplete

### No suggestions when typing

1. Must be **logged in** (instruments RLS requires auth)
2. Need **2+ characters**
3. Select **segment** first
4. Check `instruments` table has rows (Table Editor)
5. Run sync: Actions → Sync Kite instruments, or `npm run sync-instruments`

### Suggestions show but cannot select (web)

Fixed in commit `8a4a7df` — ensure latest deploy. Radix dialog was blocking portaled dropdown clicks.

### Dropdown wrong position on mobile keyboard

1. Update to latest deploy (`visualViewport` listener)
2. Workaround: scroll dialog or use manual “Use [symbol]” entry
3. Press Enter to accept typed symbol

### Only expired options showing

Re-run instrument sync. Search filters `expiry >= today` for derivatives.

---

## PWA / mobile

### Installed app opens landing page

1. Remove home screen shortcut and re-add after deploy
2. `start_url` should be `/app` in `public/manifest.json`
3. Standalone redirect on `/` should send to `/app` or dashboard

### Install instructions unclear (Android)

Banner on `/app` shows ⋮ menu → Install / Add to Home screen.

### Content under notch / home indicator

Update to deploy with safe-area CSS. Re-add PWA shortcut after update.

---

## Dashboard

### Top winners and losers show same trades

Fixed in `31be52e`. Winners = P&L > 0 only; losers = P&L < 0 only.

### Charts empty

No trades yet — log at least one closed trade.

---

## Instrument sync

### GitHub Action fails

1. Check `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` secrets
2. Confirm `instruments.sql` applied
3. Node 22 required (workflow uses 22)
4. Script uses REST not WebSocket (fix in `d2d934f`)

### Local sync fails

```bash
# .env.local needs:
VITE_SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...   # service_role, NOT anon
npm run sync-instruments
```

---

## Build / deploy

### Vercel build fails

1. Run `npm run build` locally
2. Check GitHub Actions → Build workflow
3. Ensure all env vars set for build (placeholders OK in CI)

### ESLint fails locally

Known config issue with `AudioWorkletGlobalScope` — use `npm run build` as gate.

---

## Still stuck?

1. Browser console + Network tab for API errors
2. Supabase logs for auth/RLS failures
3. See [OPERATIONS.md](./OPERATIONS.md) for runbook steps
