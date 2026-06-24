# Nivesh Pustika — User Journey & Features

This document describes how traders discover, sign up, and use Nivesh Pustika — from first visit to daily journaling.

---

## Who it’s for

**Indian market traders** who want a simple place to:

- Record closed trades (equity, F&O, currency, commodities)
- See net P&L in ₹
- Review win rate, equity curve, and best/worst trades
- Use the same app on **phone** (browser or home-screen install) and **desktop**

No payment or trial gate today — every signed-in user gets full access (“Standard plan”).

---

## Journey map

```
┌─────────────────────────────────────────────────────────────────┐
│  DISCOVER                                                        │
│  Google / link → niveshpustika.in (landing page)                 │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  SIGN UP / SIGN IN  (/app)                                       │
│  • Google account                                                │
│  • OR Indian mobile + 6-digit SMS OTP                          │
│  • Optional: install PWA (iOS Share / Android menu)            │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  DASHBOARD  (/dashboard)                                         │
│  First view after login — performance at a glance                │
└────────────────────────────┬────────────────────────────────────┘
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
         Log trade      Browse trades    Profile
         (FAB/dialog)   (/trades)        (/profile)
```

### Installed app (PWA) journey

When opened from the **home screen icon**:

1. App opens at **`/app`** (login) — not the marketing page
2. If **already logged in** → goes straight to **Dashboard**
3. If **logged out** → login screen with install hints (first time in browser only)

---

## Step-by-step user flows

### 1. Landing (`/`)

**Goal:** Understand the product and start free.

- Cinematic hero with product preview
- Primary CTA: **Start / Log in** → `/app`
- Footer links: Sign up, Log in, Privacy, Terms
- **Web only** — installed PWA skips this page

---

### 2. Sign in (`/app`)

**Goal:** Authenticate quickly on mobile or desktop.

#### Option A — Google
1. Tap **Continue with Google**
2. Google OAuth redirect
3. Lands on **Dashboard**
4. If OAuth fails, error toast explains the issue

#### Option B — Mobile OTP
1. Enter 10-digit Indian mobile (+91)
2. Tap **Send OTP**
3. Enter 6-digit SMS code
4. Tap **Verify & Continue** → Dashboard
5. **Resend OTP** available after 60s cooldown
6. **Change number** to go back

#### Install prompt (mobile browser only)
- **iOS:** Share → Add to Home Screen
- **Android:** Install button (if offered) or ⋮ menu → Install / Add to Home screen
- Dismissible; hidden when already installed

---

### 3. Dashboard (`/dashboard`)

**Goal:** See how trading is going overall.

**KPI cards:**
- Net P&L (₹)
- Win rate %
- Total trades
- Profit factor
- Average win / average loss
- Largest win / largest loss

**Charts:**
- **Equity curve** — cumulative P&L over time
- **Win/Loss pie** — proportion of winning vs losing trades
- **Segment bar chart** — P&L by segment (Equity, Futures, etc.)
- **Monthly bars** — P&L by month

**Tables:**
- **Top winners** — best trades by P&L
- **Top losers** — worst trades by P&L (only actual losses)

**Navigation:**
- Desktop: left sidebar (Dashboard, Trades, Profile, Logout)
- Mobile: bottom tabs + floating **+** button to log a trade

---

### 4. Log a trade (FAB or Trades page)

**Goal:** Record one closed trade with correct size and P&L.

1. Tap **+** (FAB) anywhere in the app shell
2. Trade dialog opens (bottom sheet on mobile, centered on desktop)

**Fields:**

| Field | Notes |
|-------|--------|
| **Segment** | Equity, Futures, Options, Currency, Commodities |
| **Symbol** | Autocomplete from ~98k instruments; manual entry OK |
| **Entry / Exit price** | Numeric |
| **Size** | Shares (equity) or lots × lot size (derivatives) |
| **Direction** | Long or Short |
| **Entry / Exit date** | Exit must be on or after entry |
| **P&L** | Auto-calculated from prices, size, direction |

**Symbol search:**
- Type 2+ characters → suggestions (NSE, NFO, MCX, etc.)
- Pick a row **or** use “Use [symbol]” for manual symbols
- Lot size auto-fills from instrument when available

3. **Save** → trade stored → dialog closes → lists/dashboard refresh

---

### 5. Trades (`/trades`)

**Goal:** Review, filter, edit, or delete history.

- Full table: date, symbol, segment, direction, size, P&L
- **Segment filter** — show only Equity, Futures, etc.
- **Edit** — opens same form pre-filled
- **Delete** — confirmation dialog
- Empty state when no trades (or none in selected segment)

---

### 6. Profile (`/profile`)

**Goal:** Personalize account and sign out.

- Display name (editable)
- Account identifier (phone or email depending on sign-in method)
- Member since date
- **Logout** (mobile users reach this via Profile tab)

---

### 7. Admin (`/admin`) — admin only

**Goal:** Platform overview for operator.

- Total users, trades, active users (7d), new users (7d)
- Searchable user list with trade count and P&L per user
- Drill into user → read-only trade list
- Access: Google `mentor@analystbychance.com` or configured admin phone

---

## Features summary

| Feature | Description |
|---------|-------------|
| **Multi-segment journaling** | Equity, Futures, Options, Currency, Commodities |
| **INR P&L** | Automatic from entry/exit, size, long/short |
| **Symbol autocomplete** | Kite-synced instruments, nearest expiry ordering for options |
| **Manual symbols** | Log any symbol if not in database |
| **Analytics dashboard** | KPIs, equity curve, segments, monthly, winners/losers |
| **Trade CRUD** | Create, edit, delete with validation |
| **Phone + Google auth** | OTP SMS and OAuth |
| **PWA** | Install to home screen; opens login |
| **Mobile layout** | Bottom nav, FAB, safe-area padding, keyboard-friendly dialog |
| **Admin panel** | User and trade overview |
| **Legal** | Privacy policy and terms pages |

---

## Platform-specific experience

| | Web (desktop) | Mobile browser | Installed PWA |
|--|---------------|----------------|---------------|
| **Entry** | Landing or `/app` | Landing or `/app` | `/app` or Dashboard |
| **Navigation** | Sidebar | Bottom tabs | Bottom tabs |
| **Log trade** | FAB → dialog | FAB → bottom sheet | Same |
| **Install help** | — | Banner on login | Already installed |
| **Logout** | Sidebar | Profile page | Profile page |

---

## Emotional journey (product intent)

1. **Curiosity** — “A trading journal built for Indian markets”
2. **Trust** — Free, no card; phone or Google sign-in
3. **First win** — Log one trade in under a minute
4. **Insight** — Dashboard shows whether strategy is working
5. **Habit** — FAB + mobile install → log after market close
6. **Retention** — History in Trades; equity curve shows progress over weeks

---

## What users cannot do (today)

- Live prices or broker sync for auto-import
- Open/pending positions (closed trades only)
- Multiple portfolios or accounts
- Export CSV / tax reports
- Trade notes or tags
- Push notifications
- Social sharing or copy trading

These are natural **future** extensions — see [ROADMAP.md](./ROADMAP.md).

---

## Support & contact

- Product site: [niveshpustika.in](https://niveshpustika.in)
- Privacy/Terms linked from login and footer
- Public contact email on legal pages: `contact@niveshpustika.in`

---

## Related docs

See **[README.md](./README.md)** for the full index.

- [nivesh.md](./nivesh.md) — architecture, stack, deployment
- [ROADMAP.md](./ROADMAP.md) — planned features
