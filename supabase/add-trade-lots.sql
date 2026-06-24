-- Run in Supabase SQL Editor to support lot-based derivative trades.
alter table public.trades
  add column if not exists lot_size integer,
  add column if not exists lots integer;
