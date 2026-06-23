# Nivesh Pustika — Complete Auth Setup Guide

**Phone OTP + Google Sign-In**

This guide walks you through setting up login for your live app at **https://niveshpustika.in**.

You do **not** need to write code. Everything is configured in online dashboards (Supabase, Google, Twilio, Vercel).

**Time needed:** about 45–60 minutes the first time.

---

## What you are setting up

| Login method | How users sign in |
|--------------|-------------------|
| **Phone + OTP** | Enter 10-digit mobile → receive SMS code → enter code |
| **Google** | Tap "Continue with Google" → pick Google account |

Both methods are already built into your app at **https://niveshpustika.in/app**.

---

## Before you start — checklist

Make sure you have:

- [ ] Access to **Supabase** dashboard (your project is already created)
- [ ] Access to **Vercel** dashboard (your site is deployed)
- [ ] A **Google account** (for Google Cloud setup)
- [ ] A **Twilio account** (free to sign up; you will add a small paid US phone number ~$1–2/month)
- [ ] Your **admin email**: `contact@niveshpustika.in` (for Google admin login)
- [ ] Your **admin mobile**: your personal Indian number (for phone admin login)

---

## Part 0 — Find your Supabase project details

You will need these values many times.

1. Go to **https://supabase.com** and log in.
2. Open your **Nivesh Pustika** project.
3. In the left menu, click **Project Settings** (gear icon at bottom).
4. Click **API** in the sub-menu.

Write down or keep this tab open:

| Name | Where to find it | Example shape |
|------|------------------|---------------|
| **Project URL** | Under "Project URL" | `https://xxxxx.supabase.co` |
| **anon public key** | Under "Project API keys" → `anon` `public` | Long string starting with `eyJ...` |

5. Still in Project Settings, note your **Project Reference ID** — it is the random part of the URL (e.g. `fhqsglcjowerrynjgfqb`).

**Your Supabase callback URL for Google** (copy this exactly — you will paste it in Google later):

```
https://YOUR-PROJECT-REF.supabase.co/auth/v1/callback
```

Replace `YOUR-PROJECT-REF` with your actual project ID.

**Example:**
```
https://fhqsglcjowerrynjgfqb.supabase.co/auth/v1/callback
```

---

## Part 1 — Supabase URL settings (required for both Google and Phone)

This tells Supabase which website URLs are allowed after login.

1. Supabase → left menu → **Authentication**
2. Click **URL Configuration**
3. Set these fields:

| Field | Value |
|-------|--------|
| **Site URL** | `https://niveshpustika.in` |
| **Redirect URLs** | Add each line below (one per line or comma-separated, depending on UI) |

**Redirect URLs to add:**

```
https://niveshpustika.in/**
https://www.niveshpustika.in/**
http://localhost:3000/**
```

4. Click **Save**.

> **Why localhost?** So you can test on your computer during development.

---

# PART A — Google Sign-In Setup

---

## Part 2 — Create Google OAuth credentials

Google needs to know your app is allowed to use "Sign in with Google."

### Step 2.1 — Open Google Cloud Console

1. Go to **https://console.cloud.google.com**
2. Log in with your Google account (can be `contact@niveshpustika.in` or any Google account you control).

### Step 2.2 — Create a project (if you don't have one)

1. At the top, click the **project dropdown** (may say "Select a project").
2. Click **New Project**.
3. Project name: `Nivesh Pustika`
4. Click **Create**.
5. Wait a few seconds, then select this new project from the dropdown.

### Step 2.3 — Configure OAuth consent screen

This is the screen users see when Google asks "Allow Nivesh Pustika to access your account?"

1. Left menu → **APIs & Services** → **OAuth consent screen**
2. User type: choose **External** → **Create**
3. Fill in the form:

| Field | What to enter |
|-------|----------------|
| App name | `Nivesh Pustika` |
| User support email | Your email |
| Developer contact email | Your email |

4. Click **Save and Continue**
5. **Scopes** page → click **Save and Continue** (defaults are fine)
6. **Test users** (if app is in "Testing" mode) → click **Add users** → add your Gmail addresses you want to test with → **Save**
7. Click **Back to Dashboard**

> While the app is in **Testing** mode, only emails you add as test users can sign in with Google. For public launch, you will **Publish app** on the consent screen later.

### Step 2.4 — Create OAuth Client ID

1. Left menu → **APIs & Services** → **Credentials**
2. Click **+ Create Credentials** → **OAuth client ID**
3. Application type: **Web application**
4. Name: `Nivesh Pustika Web`

5. Under **Authorized JavaScript origins**, click **Add URI** and add:

```
https://niveshpustika.in
https://www.niveshpustika.in
http://localhost:3000
```

6. Under **Authorized redirect URIs**, click **Add URI** and add **exactly** your Supabase callback URL from Part 0:

```
https://YOUR-PROJECT-REF.supabase.co/auth/v1/callback
```

7. Click **Create**

8. A popup shows **Client ID** and **Client Secret**.

   **Copy both and save them somewhere safe** (Notes app, password manager). You will paste them into Supabase next.

   - Client ID looks like: `123456789-xxxx.apps.googleusercontent.com`
   - Client Secret looks like: `GOCSPX-xxxxxxxx`

---

## Part 3 — Enable Google in Supabase

1. Supabase → **Authentication** → **Providers**
2. Find **Google** in the list
3. Toggle **Enable**
4. Paste:
   - **Client ID** (from Google)
   - **Client Secret** (from Google)
5. Click **Save**

### Test Google login

1. Open **https://niveshpustika.in/app** in your browser
2. Click **Continue with Google**
3. Pick your Google account
4. You should land on **https://niveshpustika.in/dashboard**

**If it fails:**

| Problem | Fix |
|---------|-----|
| "Access blocked" / app not verified | Add your email under Google OAuth **Test users**, or publish the consent screen |
| Redirect error | Check redirect URI in Google matches Supabase callback **exactly** |
| Blank page after Google | Check Supabase **Redirect URLs** include `https://niveshpustika.in/**` |

---

## Part 3B — Fix: Google shows your Supabase URL (not Nivesh Pustika)

### Why this happens

When users click **Continue with Google**, Google briefly shows a screen like:

> **Sign in to continue to** `abcdefghij.supabase.co`

That is **normal** with Supabase. Google login works through Supabase’s servers, so Google displays the **callback domain** (`*.supabase.co`), not `niveshpustika.in`.

Your app is fine — this is a **branding/trust** issue, not a bug.

---

### Option 1 — Free: improve Google branding (do this first)

This makes the screen show **“Nivesh Pustika”** with your logo. The small “continue to supabase.co” line may still appear, but the app name looks professional.

1. Go to **https://console.cloud.google.com**
2. Select your **Nivesh Pustika** project
3. Left menu → **Google Auth Platform** (or **APIs & Services** → **OAuth consent screen**)
4. Open **Branding** and fill in:

| Field | Value |
|-------|--------|
| App name | `Nivesh Pustika` |
| User support email | `contact@niveshpustika.in` |
| App logo | Upload your logo (`public/logo.png` from the project) |
| Application home page | `https://niveshpustika.in` |
| Privacy policy | `https://niveshpustika.in/privacy` |
| Terms of service | `https://niveshpustika.in/terms` |

5. Under **Authorized domains**, add:
   - `niveshpustika.in`
   - `supabase.co` (required while using Supabase auth)

6. Click **Save**

7. **Optional but recommended:** Submit for **Brand verification** (Google may take a few business days). Verified apps look more trustworthy.

8. When ready for public users: change **Publishing status** from **Testing** to **In production** (OAuth consent screen → **Publish app**).

> **Note:** Branding improves the main title. To fully replace `supabase.co` with your own domain, use Option 2 below.

---

### Option 2 — Best fix: Supabase custom domain (paid)

To show **`auth.niveshpustika.in`** (or similar) instead of `xxxxx.supabase.co`, you need a **Supabase Custom Domain**. This is a **paid add-on** on Supabase Pro plan (~$25/month + domain add-on fee).

**What users will see after setup:**

> **Sign in to continue to** `auth.niveshpustika.in`

That matches your brand much better.

#### Step-by-step (overview)

1. **Upgrade Supabase** to Pro (if not already)  
   Supabase Dashboard → **Settings** → **Billing**

2. **Pick a subdomain** (recommended: `auth.niveshpustika.in`)

3. **Supabase Dashboard** → **Project Settings** → **General** → **Custom Domains**  
   Follow the wizard to add `auth.niveshpustika.in`

4. **DNS (where you bought niveshpustika.in — e.g. GoDaddy, Cloudflare, Namecheap):**
   - Add **CNAME** record:
     - Name/Host: `auth`
     - Points to: `YOUR-PROJECT-REF.supabase.co` (Supabase shows the exact value)
   - Add **TXT** records Supabase gives you (to prove you own the domain)
   - Wait 15–60 minutes for DNS to propagate

5. **Activate** the custom domain in Supabase when verification passes

6. **Google Cloud Console** → your OAuth client → **Authorized redirect URIs**  
   Add the **new** callback URL (keep the old one too during transition):
   ```
   https://auth.niveshpustika.in/auth/v1/callback
   ```

7. **Vercel** → Project → **Settings** → **Environment Variables**  
   Update:
   ```
   VITE_SUPABASE_URL=https://auth.niveshpustika.in
   ```
   (Keep the same anon key — only the URL changes.)

8. **Redeploy** on Vercel (Deployments → Redeploy)

9. Test Google login again — Google should now show `auth.niveshpustika.in`

#### Also update locally

In your `.env.local`:
```
VITE_SUPABASE_URL=https://auth.niveshpustika.in
```

---

### Option 3 — Cheaper alternative: vanity subdomain (still says supabase.co)

Supabase Pro also offers a **vanity subdomain** like `niveshpustika.supabase.co` instead of random letters. It looks slightly cleaner but **still contains “supabase.co”**. Custom domain (Option 2) is better for a public product.

---

### Quick comparison

| Option | Cost | What Google shows | Effort |
|--------|------|-------------------|--------|
| **1. Google branding** | Free | App name “Nivesh Pustika” + may still show `*.supabase.co` | 15 min |
| **2. Custom domain** | Supabase Pro + add-on | `auth.niveshpustika.in` | 1–2 hours |
| **3. Vanity subdomain** | Supabase Pro | `niveshpustika.supabase.co` | CLI setup |

**Recommendation:** Do **Option 1 today** (free). Plan **Option 2** when you want a fully branded login for all users.

---

# PART B — Phone OTP Setup (Twilio)

---

## Part 4 — Create Twilio account

1. Go to **https://www.twilio.com/try-twilio**
2. Sign up (email + phone verification)
3. Complete account setup

> **Trial accounts:** Twilio trial can only send SMS to **verified phone numbers** until you upgrade. For first tests, verify your own Indian mobile in Twilio.

---

## Part 5 — Buy a US phone number (you do NOT need an Indian number)

Twilio often does **not** sell Indian numbers to new accounts. That is normal.

**A US number can send OTP SMS to Indian (+91) numbers.**

### Step 5.1 — Buy the number

1. Twilio Console → **Phone Numbers** → **Manage** → **Buy a number**
2. Country: **United States (+1)**
3. Capabilities: check **SMS** (must be checked)
4. Click **Search**
5. Pick any number → **Buy**
6. Confirm (~ **$1–2 per month**)

7. **Copy your new number** — format like `+15551234567`

### Step 5.2 — Allow SMS to India

1. Twilio Console → **Account** → **Settings** (or search "Geo permissions")
2. Find **SMS Geographic Permissions** (or **Geo permissions**)
3. Find **India** in the list
4. **Enable / check** India for outbound SMS
5. Save

### Step 5.3 — (Trial only) Verify your test phone

If you are on a **free trial**:

1. Twilio → **Phone Numbers** → **Verified Caller IDs**
2. Click **Add a new Caller ID**
3. Enter **your Indian mobile** (+91...)
4. Twilio sends a verification code — enter it

Until you upgrade Twilio, OTP will only work for **verified numbers**.

### Step 5.4 — Create a Messaging Service (required by Supabase)

Supabase no longer asks for your phone number directly. Instead, you create a **Messaging Service** in Twilio and paste its **SID** (starts with `MG`).

1. Twilio Console → **Messaging** → **Services**
2. Click **Create Messaging Service**
3. **Friendly name:** `Nivesh Pustika OTP` (any name is fine)
4. **Use case:** pick **Notify my users** (or similar)
5. Click **Create Messaging Service**

6. On the next screen — **Add Senders**:
   - Click **Add Senders**
   - Choose **Phone Number**
   - Check your **US number** (the one you bought)
   - Click **Add phone numbers**

7. Click through any remaining steps (compliance can often be skipped for now) until finished

8. Open your new Messaging Service → find **Messaging Service SID**
   - Starts with `MG...`
   - **Copy and save it**

> Your US phone number lives *inside* this Messaging Service. Supabase uses the `MG...` SID to send SMS through that number.

### Step 5.5 — Get Twilio credentials for Supabase

1. Twilio Console **Dashboard** (home page)
2. Copy and save:

| Name | Where |
|------|--------|
| **Account SID** | Dashboard — starts with `AC...` |
| **Auth Token** | Dashboard — click to reveal |
| **Message Service SID** | Messaging → Services → your service — starts with `MG...` |

---

## Part 6 — Enable Phone auth in Supabase

1. Supabase → **Authentication** → **Providers**
2. Find **Phone**
3. Toggle **Enable**
4. SMS provider: **Twilio**
5. Fill in:

| Field | Value |
|-------|--------|
| Twilio Account SID | Your `AC...` value |
| Twilio Auth Token | Your auth token |
| Twilio Message Service SID | Your `MG...` value from Step 5.4 |
| Content SID | **Leave empty** (only needed for WhatsApp templates) |
| Test Phone Numbers and OTPs | **Optional** — see below |

6. Click **Save**

> **Note:** Supabase uses **Message Service SID**, not the phone number field. Your US number must be added to that Messaging Service in Twilio (Step 5.4).

### Test Phone Numbers (optional — for quick testing)

In **Test Phone Numbers and OTPs**, you can add a fake test entry so Supabase accepts a fixed OTP without sending a real SMS:

```
919876543210=123456
```

Format: `10-digit-number=fixed-otp` (no +91). Useful on Twilio trial. For real SMS testing, leave this empty.

### Optional — Phone settings

Under Phone provider settings, defaults are usually fine:

- OTP length: **6 digits**
- OTP expiry: **60 seconds** (or increase to 120 if users need more time)

---

## Part 7 — Test Phone OTP

1. Open **https://niveshpustika.in/app** on your phone (or desktop)
2. Enter your **10-digit Indian mobile** (no +91 in the box — the app adds +91 automatically)
3. Click **Send OTP**
4. Wait for SMS (can take 10–30 seconds)
5. Enter the **6-digit code**
6. Click **Verify & Continue**
7. You should reach **/dashboard**

**On mobile:** You should also see the **Install app** banner on the sign-in page.

### Phone OTP troubleshooting

| Problem | What to do |
|---------|------------|
| "Could not send OTP" | Check Twilio credentials in Supabase; check Twilio balance |
| SMS never arrives | Enable **India** in Twilio geo permissions; on trial, verify your number in Twilio |
| "Invalid OTP" | Code expires in ~60s — request new OTP; type all 6 digits |
| Error 21612 (Twilio) | Your "from" number cannot reach India — use **US** number + enable India geo |
| Works on one phone only | Twilio **trial** — upgrade account or verify each test number |

---

# PART C — Vercel environment variables

Your live site needs these secrets. They are **already set** for Supabase URL and anon key — you may only need to **add admin phone**.

1. Go to **https://vercel.com** → your **niveshpustika** project
2. **Settings** → **Environment Variables**
3. Confirm these exist (add any that are missing):

| Variable name | Value | Notes |
|---------------|-------|-------|
| `VITE_SUPABASE_URL` | `https://xxxxx.supabase.co` | From Supabase → Settings → API |
| `VITE_SUPABASE_ANON_KEY` | `eyJ...` | From Supabase → Settings → API |
| `VITE_ADMIN_EMAIL` | `contact@niveshpustika.in` | For Google admin login to `/admin` |
| `VITE_ADMIN_PHONE` | `+919876543210` | **Your** admin mobile with country code |

4. After adding/changing variables → go to **Deployments** → **Redeploy** latest deployment

> **Important:** Never put these in GitHub. Only in Vercel and your local `.env.local` file.

---

# PART D — Admin access

Your admin panel: **https://niveshpustika.in/admin**

You can access it if you log in with:

- **Google** using `contact@niveshpustika.in`, OR
- **Phone OTP** using the number set in `VITE_ADMIN_PHONE`

Regular users who log in will **not** see the admin panel — they get redirected to dashboard.

### Make sure admin works in Supabase database

Your admin email must match the SQL rules in Supabase. If you haven't run the admin email fix:

1. Supabase → **SQL Editor** → **New query**
2. Open file `supabase/fix-admin-email.sql` from your project
3. Paste and **Run**

---

# PART E — Final testing checklist

Go through this list once everything is configured:

### Google auth
- [ ] Open https://niveshpustika.in/app
- [ ] Click **Continue with Google**
- [ ] Sign in succeeds → dashboard loads
- [ ] Log out from Profile → try again

### Phone auth
- [ ] Open https://niveshpustika.in/app
- [ ] Enter mobile → **Send OTP**
- [ ] SMS received within 30 seconds
- [ ] Enter OTP → dashboard loads

### Mobile PWA
- [ ] Open site on phone → go to /app
- [ ] See **Install app** or **Add to Home Screen** instructions
- [ ] Install → open from home screen → still works

### Admin
- [ ] Log in as admin (Google or phone)
- [ ] Open https://niveshpustika.in/admin
- [ ] See user list and stats

### App features after login
- [ ] Add a test trade (+ button)
- [ ] See trade on /trades
- [ ] Dashboard shows stats
- [ ] Profile shows Standard plan + your name/mobile

---

# Quick reference — where each piece lives

```
User visits niveshpustika.in/app
         │
         ├── Google button ──► Google OAuth ──► Supabase Auth ──► Dashboard
         │
         └── Phone + OTP ──► Supabase Auth ──► Twilio SMS ──► User's phone
                                    │
                                    └── Verify OTP ──► Dashboard
```

| Service | What it does | Login to |
|---------|--------------|----------|
| **Supabase** | Stores users, verifies OTP, creates sessions | supabase.com |
| **Google Cloud** | Powers "Sign in with Google" | console.cloud.google.com |
| **Twilio** | Sends SMS with OTP code | twilio.com |
| **Vercel** | Hosts your live website | vercel.com |

---

# Costs (approximate)

| Item | Cost |
|------|------|
| Supabase (free tier) | $0 for small usage |
| Vercel (hobby) | $0 |
| Google OAuth | $0 |
| Twilio US number | ~$1–2 / month |
| Twilio SMS to India | ~$0.05–0.08 per SMS (varies) |
| Google Cloud | $0 for OAuth |

---

# When you outgrow Twilio (optional, later)

India has strict SMS rules (DLT). For high volume, many Indian apps switch to **MSG91** with a Supabase **SMS Hook**. Your app code stays the same — only Supabase + SMS provider config changes.

For now, **Twilio US number + India geo enabled** is enough to launch and test.

---

# Need help?

When asking for help, include:

1. Which step failed (Google or Phone)
2. Exact error message (screenshot or text)
3. Whether you are on Twilio trial or paid
4. The phone number format you used (last 4 digits only — don't share full number publicly)

---

**Document version:** March 2026  
**App:** Nivesh Pustika — https://niveshpustika.in  
**Sign-in page:** https://niveshpustika.in/app
