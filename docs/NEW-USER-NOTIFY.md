# Admin SMS on new user signup

Sends you an SMS via **Twilio** (same Messaging Service as OTP) when a **new profile** is created — phone OTP or Google OAuth.

---

## 1. Deploy the Edge Function

From repo root (Supabase CLI logged in and linked):

```bash
supabase secrets set TWILIO_ACCOUNT_SID=ACxxxxxxxx
supabase secrets set TWILIO_AUTH_TOKEN=your_auth_token
supabase secrets set TWILIO_MESSAGING_SERVICE_SID=MGxxxxxxxx
supabase secrets set ADMIN_NOTIFY_PHONE=+918109901136
supabase secrets set ADMIN_NOTIFY_EMAIL=mentor@analystbychance.com
# Optional extra guard:
supabase secrets set NOTIFY_WEBHOOK_SECRET=choose_a_long_random_string

supabase functions deploy notify-new-user
```

Use the same **Account SID**, **Auth Token**, and **Messaging Service SID** (`MG…`) as in Supabase → Authentication → Phone → Twilio.

---

## 2. Create Database Webhook

**Supabase Dashboard → Database → Webhooks → Create webhook**

| Field | Value |
|-------|--------|
| **Name** | `notify-new-user` |
| **Table** | `profiles` |
| **Events** | **Insert** only |
| **Type** | Supabase Edge Function |
| **Function** | `notify-new-user` |

If using manual HTTP instead of Edge Function picker:

- **URL:** `https://YOUR_PROJECT_REF.supabase.co/functions/v1/notify-new-user`
- **Method:** POST
- **Headers:**
  - `Authorization: Bearer YOUR_SERVICE_ROLE_KEY`
  - `Content-Type: application/json`
  - `x-webhook-secret: same as NOTIFY_WEBHOOK_SECRET` (if set)

---

## 3. Test

### A — Real signup (recommended)

1. Sign up with a **non-admin** phone or Google account on `/app`.
2. You should receive SMS on `ADMIN_NOTIFY_PHONE`.
3. Check **Twilio → Monitor → Logs** if no SMS.

### B — Admin signup (should skip)

Sign in with admin email/phone — **no** SMS (function returns `skipped: admin signup`).

### C — Twilio logs

Expect same pattern as OTP: **Messaging Service** `MG…`, **From** may show as `+59039149`, **To** your admin number, **Delivered**.

---

## Message format

```
Nivesh Pustika: New signup via Phone OTP (+919876543210)
Nivesh Pustika: New signup via Google (Rahul). user@gmail.com
```

---

## India DLT note

OTP uses Supabase’s verification flow. This is a **custom transactional** message. If Twilio rejects it, check **Monitor → Logs** for DLT/template errors and register a short template with your DLT provider if required.

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| No SMS | Webhook enabled? Function deployed? Secrets set? Twilio balance? |
| 401 Unauthorized | `x-webhook-secret` header must match `NOTIFY_WEBHOOK_SECRET` |
| 500 Twilio not configured | Set all three `TWILIO_*` secrets |
| SMS on every login | Webhook must be **INSERT on profiles only**, not auth events |
| Admin gets notified for self | Check `ADMIN_NOTIFY_EMAIL` / `ADMIN_NOTIFY_PHONE` match admin account |

---

## Related

- [phone-auth-setup.md](./phone-auth-setup.md)
- [OPERATIONS.md](./OPERATIONS.md)
