-- Run this in your Supabase SQL editor to set up the database.
-- Set VITE_ADMIN_EMAIL in .env.local to match the admin email below.

-- Profiles (extends auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text,
  email text,
  last_active timestamptz default now(),
  status text default 'active',
  created_at timestamptz default now()
);

-- Trades
create table if not exists public.trades (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  segment text not null,
  symbol text not null,
  entry_price numeric not null,
  exit_price numeric not null,
  quantity integer not null,
  direction text not null check (direction in ('long', 'short')),
  entry_time timestamptz not null,
  exit_time timestamptz not null,
  pnl numeric not null,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;
alter table public.trades enable row level security;

-- Profiles policies (drop first so this file can be re-run safely)
drop policy if exists "Users can view own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "Users can insert own profile" on public.profiles;
drop policy if exists "Admin can view all profiles" on public.profiles;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Admin can view all profiles"
  on public.profiles for select
  using (auth.jwt() ->> 'email' = 'contact@niveshpustika.in');

-- Trades policies
drop policy if exists "Users can view own trades" on public.trades;
drop policy if exists "Users can insert own trades" on public.trades;
drop policy if exists "Users can update own trades" on public.trades;
drop policy if exists "Users can delete own trades" on public.trades;
drop policy if exists "Admin can view all trades" on public.trades;

create policy "Users can view own trades"
  on public.trades for select
  using (auth.uid() = user_id);

create policy "Users can insert own trades"
  on public.trades for insert
  with check (auth.uid() = user_id);

create policy "Users can update own trades"
  on public.trades for update
  using (auth.uid() = user_id);

create policy "Users can delete own trades"
  on public.trades for delete
  using (auth.uid() = user_id);

create policy "Admin can view all trades"
  on public.trades for select
  using (auth.jwt() ->> 'email' = 'contact@niveshpustika.in');

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
