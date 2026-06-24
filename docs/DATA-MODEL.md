# Data Model

Supabase PostgreSQL schema for Nivesh Pustika.

---

## Entity diagram

```
auth.users (Supabase managed)
    │
    │ 1:1
    ▼
public.profiles
    │
    │ 1:N
    ▼
public.trades

public.instruments (standalone reference data)
```

---

## `public.profiles`

Extends `auth.users` with app-specific fields.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | FK → `auth.users(id)` ON DELETE CASCADE |
| `name` | text | Display name |
| `email` | text | From auth (may be null for phone-only) |
| `last_active` | timestamptz | Updated on session bootstrap |
| `status` | text | Default `'active'` |
| `created_at` | timestamptz | Default `now()` |

**RLS policies:**
- Users: SELECT, UPDATE, INSERT own row (`auth.uid() = id`)
- Admin: SELECT all (via `is_admin()`)

**Trigger:** `handle_new_user()` on `auth.users` INSERT creates profile (email + phone paths).

---

## `public.trades`

Closed trade journal entries.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | Default `gen_random_uuid()` |
| `user_id` | uuid FK | → `profiles(id)` |
| `segment` | text | Equity, Futures, Options, Currency, Commodities |
| `symbol` | text | e.g. RELIANCE, NIFTY24JUN24000CE |
| `entry_price` | numeric | |
| `exit_price` | numeric | |
| `quantity` | integer | Shares (equity) or total units (derivatives) |
| `lot_size` | integer | Nullable; F&O lot size |
| `lots` | integer | Nullable; number of lots |
| `direction` | text | `'long'` or `'short'` |
| `entry_time` | timestamptz | Stored from date input (noon local) |
| `exit_time` | timestamptz | Must be ≥ entry date (client validation) |
| `pnl` | numeric | Calculated on save |
| `created_at` | timestamptz | |

**P&L formula:**
- Long: `(exit - entry) × quantity`
- Short: `(entry - exit) × quantity`
- Derivatives: `quantity = lot_size × lots`

**RLS policies:**
- Users: full CRUD on own trades (`auth.uid() = user_id`)
- Admin: SELECT all

---

## `public.instruments`

Synced from Zerodha Kite instruments CSV (~98k rows).

| Column | Type | Notes |
|--------|------|-------|
| `id` | bigserial PK | |
| `exchange` | text | NSE, NFO, BFO, MCX, CDS, etc. |
| `tradingsymbol` | text | Unique with exchange |
| `name` | text | Company/instrument name |
| `app_segment` | text | Maps to app TRADE_SEGMENTS |
| `instrument_type` | text | EQ, FUT, CE, PE, … |
| `expiry` | date | Nullable (equity) |
| `strike` | numeric | Nullable |
| `lot_size` | integer | May be corrected client-side for MCX/CDS |
| `tick_size` | numeric | |
| `synced_at` | timestamptz | Last sync time |

**Unique:** `(exchange, tradingsymbol)`

**RLS:** Authenticated users SELECT only. Writes via service role in sync script.

---

## `public.is_admin()`

SQL function used in RLS policies.

```sql
-- Matches VITE_ADMIN_EMAIL (lowercase) OR last 10 digits of VITE_ADMIN_PHONE
lower(email) = 'mentor@analystbychance.com'
OR phone_last_10 = '8109901136'
```

Must stay in sync with Vercel env vars. Update via `supabase/fix-admin-email.sql`.

---

## Auth (Supabase managed)

| Method | Provider |
|--------|----------|
| Phone OTP | Supabase Auth SMS |
| Google OAuth | Supabase Auth Google provider |

Session stored in browser; JWT contains email/phone for RLS.

---

## Indexes (instruments)

- `(app_segment, tradingsymbol)`
- `(app_segment, name)`
- `(expiry)` partial where expiry IS NOT NULL

---

## Migration files

Located in `supabase/`:

| File | Purpose |
|------|---------|
| `schema.sql` | Full schema + RLS + triggers |
| `fix-admin-email.sql` | Update admin function |
| `fix-phone-profile.sql` | Phone trigger + backfill |
| `instruments.sql` | Instruments table |
| `add-trade-lots.sql` | lot_size, lots columns |

---

## Related docs

- [OPERATIONS.md](./OPERATIONS.md)
- [instruments-setup.md](./instruments-setup.md)
