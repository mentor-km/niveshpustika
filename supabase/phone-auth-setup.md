# Phone OTP setup (Supabase)

Enable phone authentication so users can sign in with mobile + OTP.

## 1. Supabase Dashboard

1. **Authentication → Providers → Phone** → Enable
2. Choose SMS provider:
   - **Twilio** (recommended for production India)
   - Or **MessageBird** / test mode for development

3. Add credentials from your SMS provider in Supabase phone settings.

## 2. Site URL & redirects

**Authentication → URL Configuration**

- Site URL: `https://niveshpustika.in`
- Redirect URLs:
  - `https://niveshpustika.in/**`
  - `http://localhost:3000/**`

## 3. Google sign-in (optional but recommended)

1. **Authentication → Providers → Google** → Enable
2. Add Google OAuth Client ID & Secret from Google Cloud Console
3. Authorized redirect URI: your Supabase callback URL

## 4. Environment variables

Add to Vercel and `.env.local`:

```
VITE_ADMIN_PHONE=+91XXXXXXXXXX   # Your admin mobile (10 digits with +91)
VITE_ADMIN_EMAIL=contact@niveshpustika.in   # For Google admin login
```

## 5. Profiles table (optional phone column)

Run in SQL Editor if you want phone stored on profiles:

```sql
alter table public.profiles add column if not exists phone text;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, name, phone)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'name', split_part(coalesce(new.email, new.phone, ''), '@', 1)),
    new.phone
  );
  return new;
end;
$$;
```

## 6. Test flow

1. Open `/app` on mobile
2. Enter 10-digit Indian number → Send OTP
3. Enter 6-digit code → lands on `/dashboard`
4. Install PWA banner appears on sign-in page
