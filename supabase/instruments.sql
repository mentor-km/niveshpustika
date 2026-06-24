-- Instrument master synced from Kite CSV (run sync-kite-instruments.mjs daily).
-- Public read for logged-in users; writes use service role only.

create table if not exists public.instruments (
  id bigserial primary key,
  exchange text not null,
  tradingsymbol text not null,
  name text,
  app_segment text not null,
  instrument_type text,
  expiry date,
  strike numeric,
  lot_size integer,
  tick_size numeric,
  synced_at timestamptz default now(),
  unique (exchange, tradingsymbol)
);

create index if not exists instruments_app_segment_symbol_idx
  on public.instruments (app_segment, tradingsymbol);

create index if not exists instruments_app_segment_name_idx
  on public.instruments (app_segment, name);

create index if not exists instruments_expiry_idx
  on public.instruments (expiry)
  where expiry is not null;

alter table public.instruments enable row level security;

drop policy if exists "Authenticated users can search instruments" on public.instruments;
create policy "Authenticated users can search instruments"
  on public.instruments for select
  to authenticated
  using (true);
