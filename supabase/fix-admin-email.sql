-- Run this ONCE in Supabase SQL Editor.
-- Must match VITE_ADMIN_EMAIL and VITE_ADMIN_PHONE in Vercel / .env.local

-- ─── CONFIG (edit if your admin email or phone changes) ───────────────────
-- Admin email: contact@niveshpustika.in
-- Admin phone: +918109901136 (last 10 digits used for matching)

create or replace function public.is_admin()
returns boolean
language sql
stable
set search_path = public
as $$
  select
    lower(coalesce(auth.jwt() ->> 'email', '')) = 'mentor@analystbychance.com'
    or right(
      regexp_replace(coalesce(auth.jwt() ->> 'phone', ''), '[^0-9]', '', 'g'),
      10
    ) = '8109901136'
$$;

-- Remove old admin rules (safe to re-run)
drop policy if exists "Admin can view all profiles" on public.profiles;
drop policy if exists "Admin can view all trades" on public.trades;

create policy "Admin can view all profiles"
  on public.profiles for select
  using (public.is_admin());

create policy "Admin can view all trades"
  on public.trades for select
  using (public.is_admin());
