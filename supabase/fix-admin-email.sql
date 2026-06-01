-- Run this ONCE in Supabase SQL Editor to set your admin email.
-- Must match VITE_ADMIN_EMAIL in .env.local exactly.

-- Remove old admin rules (safe even if names differ)
drop policy if exists "Admin can view all profiles" on public.profiles;
drop policy if exists "Admin can view all trades" on public.trades;

-- Create admin rules with YOUR email
create policy "Admin can view all profiles"
  on public.profiles for select
  using (auth.jwt() ->> 'email' = 'contact@niveshpustika.in');

create policy "Admin can view all trades"
  on public.trades for select
  using (auth.jwt() ->> 'email' = 'contact@niveshpustika.in');
