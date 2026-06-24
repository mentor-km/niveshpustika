# Cloudflare Turnstile (Send OTP)

Production phone login uses Turnstile before SMS OTP is sent. Without a site key, the app calls Supabase Auth directly (fine for local dev).

---

## 1. Create Turnstile widget

1. [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Turnstile** → **Add site**
2. **Widget mode:** Managed (recommended)
3. **Domains:** `niveshpustika.in`, `www.niveshpustika.in`, `localhost` (for testing)
4. Copy **Site key** and **Secret key**

---

## 2. Vercel (frontend)

**Settings → Environment Variables → Production**

| Variable | Value |
|----------|-------|
| `VITE_TURNSTILE_SITE_KEY` | Turnstile **site** key |

Redeploy after adding.

---

## 3. Supabase Edge Function

From repo root (Supabase CLI logged in and linked):

```bash
supabase secrets set TURNSTILE_SECRET_KEY=your_turnstile_secret_key
supabase functions deploy send-phone-otp
```

The function auto-receives `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in Supabase-hosted environments.

**Function:** `supabase/functions/send-phone-otp/index.ts`

- Verifies Turnstile token with Cloudflare
- Sends OTP via `auth.signInWithOtp` using the service role

---

## 4. Verify

1. Open `/app` on production
2. Enter phone → complete Turnstile → **Send OTP**
3. If captcha fails: check domain list in Turnstile widget settings
4. If 500 “Server not configured”: confirm `TURNSTILE_SECRET_KEY` secret and redeploy function

---

## Local development

Leave `VITE_TURNSTILE_SITE_KEY` empty in `.env.local`. OTP uses direct `signInWithOtp` (no Edge Function).

To test Turnstile locally, add the site key and include `localhost` in the Turnstile widget domains; deploy the Edge Function or use `supabase functions serve send-phone-otp`.

---

## Related

- [phone-auth-setup.md](./phone-auth-setup.md)
- [OPERATIONS.md](./OPERATIONS.md) — Supabase rate limits, Twilio caps
