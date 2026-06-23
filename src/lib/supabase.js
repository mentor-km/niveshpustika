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

export const ADMIN_PHONE =
  import.meta.env.VITE_ADMIN_PHONE || '';

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

/** Format 10-digit Indian mobile to E.164 (+91...) */
export function formatPhone(phone) {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('91') && digits.length === 12) return `+${digits}`;
  if (digits.length === 10) return `+91${digits}`;
  if (phone.startsWith('+')) return phone;
  return `+${digits}`;
}

export function isAdminUser(user) {
  if (!user) return false;
  if (user.email && isAdminEmail(user.email)) return true;
  if (ADMIN_PHONE && user.phone && formatPhone(user.phone) === formatPhone(ADMIN_PHONE)) {
    return true;
  }
  return false;
}

export function displayPhone(user) {
  const raw = user?.phone || user?.user_metadata?.phone || '';
  if (!raw) return user?.email || '—';
  const digits = raw.replace(/\D/g, '');
  if (digits.length >= 10) {
    const local = digits.slice(-10);
    return `+91 ${local.slice(0, 5)} ${local.slice(5)}`;
  }
  return raw;
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

export async function sendPhoneOtp(phone) {
  const formatted = formatPhone(phone);
  const { data, error } = await supabase.auth.signInWithOtp({
    phone: formatted,
    options: { channel: 'sms' },
  });
  if (error) throw error;
  return { phone: formatted, data };
}

export async function verifyPhoneOtp(phone, token) {
  const formatted = formatPhone(phone);
  const { data, error } = await supabase.auth.verifyOtp({
    phone: formatted,
    token,
    type: 'sms',
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
  const [profilesResult, tradesResult] = await Promise.all([
    supabase.from('profiles').select('*').order('created_at', { ascending: false }),
    supabase.from('trades').select('user_id'),
  ]);

  if (profilesResult.error) throw profilesResult.error;
  if (tradesResult.error) throw tradesResult.error;

  const tradeCountByUser = (tradesResult.data ?? []).reduce((acc, trade) => {
    acc[trade.user_id] = (acc[trade.user_id] || 0) + 1;
    return acc;
  }, {});

  return (profilesResult.data ?? []).map((profile) => ({
    ...profile,
    trades: [{ count: tradeCountByUser[profile.id] ?? 0 }],
  }));
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
