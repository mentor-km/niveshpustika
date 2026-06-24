-- Run in Supabase SQL Editor if phone users have no profile row.
-- Also updates the signup trigger to handle phone-only accounts.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  display_name text;
begin
  display_name := coalesce(
    new.raw_user_meta_data ->> 'name',
    new.raw_user_meta_data ->> 'full_name',
    null
  );

  if display_name is null and new.phone is not null then
    display_name := new.phone;
  end if;

  if display_name is null and new.email is not null then
    display_name := split_part(new.email, '@', 1);
  end if;

  if display_name is null then
    display_name := 'User';
  end if;

  insert into public.profiles (id, email, name)
  values (new.id, new.email, display_name)
  on conflict (id) do nothing;

  return new;
end;
$$;

-- Backfill profiles for auth users missing a row (safe to re-run)
insert into public.profiles (id, email, name)
select
  u.id,
  u.email,
  coalesce(
    u.raw_user_meta_data ->> 'name',
    u.raw_user_meta_data ->> 'full_name',
    u.phone,
    split_part(u.email, '@', 1),
    'User'
  )
from auth.users u
left join public.profiles p on p.id = u.id
where p.id is null
on conflict (id) do nothing;
