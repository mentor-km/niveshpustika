-- Run in Supabase SQL Editor when admin email or phone changes.
-- MUST match VITE_ADMIN_EMAIL and VITE_ADMIN_PHONE in Vercel / .env.local
--
-- Defaults (edit both lines below + env vars together):
--   Email: mentor@analystbychance.com
--   Phone: last 10 digits of VITE_ADMIN_PHONE (e.g. 8109901136 for +918109901136)

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

drop policy if exists "Admin can view all profiles" on public.profiles;
drop policy if exists "Admin can view all trades" on public.trades;

create policy "Admin can view all profiles"
  on public.profiles for select
  using (public.is_admin());

create policy "Admin can view all trades"
  on public.trades for select
  using (public.is_admin());
