import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase credentials missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local'
  );
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

export const ADMIN_EMAIL =
  import.meta.env.VITE_ADMIN_EMAIL || 'admin@niveshpustika.in';

export const TRADE_SEGMENTS = [
  'Equity',
  'Futures',
  'Options',
  'Currency',
  'MCX Commodities',
];

export function isAdminEmail(email) {
  return email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
}

export function calculatePnL({ direction, entry_price, exit_price, quantity }) {
  const entry = Number(entry_price);
  const exit = Number(exit_price);
  const qty = Number(quantity);

  if (direction === 'long') {
    return (exit - entry) * qty;
  }
  return (entry - exit) * qty;
}

export function formatCurrency(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(value ?? 0);
}

// ─── Auth ───────────────────────────────────────────────────────────────────

export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

export async function signUpWithEmail({ email, password, name }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name },
    },
  });
  if (error) throw error;
  return data;
}

export async function signInWithEmail({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/dashboard`,
    },
  });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function resetPassword(email) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/app`,
  });
  if (error) throw error;
  return data;
}

export async function updateLastActive(userId) {
  const { error } = await supabase
    .from('profiles')
    .update({ last_active: new Date().toISOString() })
    .eq('id', userId);
  if (error) throw error;
}

// ─── Profile ────────────────────────────────────────────────────────────────

export async function fetchProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) throw error;
  return data;
}

export async function updateProfile(userId, { name }) {
  const { data, error } = await supabase
    .from('profiles')
    .update({ name })
    .eq('id', userId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updatePassword(newPassword) {
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) throw error;
}

// ─── Trades ─────────────────────────────────────────────────────────────────

export async function fetchTrades(userId) {
  const { data, error } = await supabase
    .from('trades')
    .select('*')
    .eq('user_id', userId)
    .order('entry_time', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createTrade(trade) {
  const { data, error } = await supabase
    .from('trades')
    .insert(trade)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateTrade(id, trade) {
  const { data, error } = await supabase
    .from('trades')
    .update(trade)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteTrade(id) {
  const { error } = await supabase.from('trades').delete().eq('id', id);
  if (error) throw error;
}

// ─── Admin ──────────────────────────────────────────────────────────────────

export async function fetchAdminStats() {
  const [usersResult, tradesResult] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('trades').select('*', { count: 'exact', head: true }),
  ]);

  if (usersResult.error) throw usersResult.error;
  if (tradesResult.error) throw tradesResult.error;

  return {
    totalUsers: usersResult.count ?? 0,
    totalTrades: tradesResult.count ?? 0,
  };
}

export async function fetchAllUsers() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*, trades(count)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function fetchTradesByUserId(userId) {
  const { data, error } = await supabase
    .from('trades')
    .select('*')
    .eq('user_id', userId)
    .order('entry_time', { ascending: false });
  if (error) throw error;
  return data ?? [];
}
