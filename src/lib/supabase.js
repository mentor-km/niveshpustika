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
  import.meta.env.VITE_ADMIN_EMAIL || 'mentor@analystbychance.com';

export const ADMIN_PHONE =
  import.meta.env.VITE_ADMIN_PHONE || '';

export const TRADE_SEGMENTS = [
  'Equity',
  'Futures',
  'Options',
  'Currency',
  'Commodities',
];

export const EQUITY_SEGMENT = 'Equity';

export function isEquitySegment(segment) {
  return segment === EQUITY_SEGMENT;
}

/** Total units for P&L: shares for equity, lot_size × lots for derivatives. */
export function effectiveQuantity({ segment, quantity, lot_size, lots }) {
  if (isEquitySegment(segment)) {
    return Number(quantity);
  }
  return Number(lot_size) * Number(lots);
}

export function formatTradeSize(trade) {
  if (!trade) return '—';
  if (isEquitySegment(trade.segment)) {
    return `${trade.quantity} shares`;
  }
  if (trade.lot_size != null && trade.lots != null) {
    return `${trade.lots} lots × ${trade.lot_size}`;
  }
  return `${trade.quantity} qty`;
}

export function dateInputToIso(dateStr) {
  if (!dateStr) return new Date().toISOString();
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day, 12, 0, 0).toISOString();
}

export function isoToDateInput(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 10);
}

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

export function calculatePnL({ direction, entry_price, exit_price, quantity, segment, lot_size, lots }) {
  const entry = Number(entry_price);
  const exit = Number(exit_price);
  const qty = segment
    ? effectiveQuantity({ segment, quantity, lot_size, lots })
    : Number(quantity);

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

export const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || '';

export function isTurnstileRequired() {
  return Boolean(TURNSTILE_SITE_KEY);
}

async function sendPhoneOtpViaEdgeFunction(formatted, turnstileToken) {
  const res = await fetch(`${supabaseUrl}/functions/v1/send-phone-otp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${supabaseAnonKey}`,
      apikey: supabaseAnonKey,
    },
    body: JSON.stringify({ phone: formatted, turnstileToken }),
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(body.error || 'Could not send OTP');
    err.status = res.status;
    throw err;
  }
  return body;
}

export async function sendPhoneOtp(phone, { turnstileToken } = {}) {
  const formatted = formatPhone(phone);

  if (isTurnstileRequired()) {
    if (!turnstileToken) {
      throw new Error('Please complete the security check.');
    }
    await sendPhoneOtpViaEdgeFunction(formatted, turnstileToken);
    return { phone: formatted, data: null };
  }

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

/** Create profile row if missing (common for phone OTP sign-ups). */
export async function ensureProfile(user) {
  if (!user?.id) return null;

  const { data: existing, error: fetchError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();
  if (fetchError) throw fetchError;
  if (existing) return existing;

  const name =
    user.user_metadata?.name ||
    user.user_metadata?.full_name ||
    (user.phone ? displayPhone(user) : null) ||
    (user.email ? user.email.split('@')[0] : 'User');

  const { data, error } = await supabase
    .from('profiles')
    .insert({
      id: user.id,
      email: user.email || null,
      name,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ─── Profile ────────────────────────────────────────────────────────────────

export async function fetchProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
  if (error) throw error;
  if (data) return data;

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!user || user.id !== userId) {
    throw new Error('Profile not found');
  }
  return ensureProfile(user);
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
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

  const [usersCount, tradesCount, profilesResult, tradesData] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('trades').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('last_active, created_at'),
    supabase.from('trades').select('pnl'),
  ]);

  if (usersCount.error) throw usersCount.error;
  if (tradesCount.error) throw tradesCount.error;
  if (profilesResult.error) throw profilesResult.error;
  if (tradesData.error) throw tradesData.error;

  const profiles = profilesResult.data ?? [];
  const activeUsers = profiles.filter(
    (p) => p.last_active && new Date(p.last_active).getTime() > weekAgo
  ).length;
  const newUsers = profiles.filter(
    (p) => p.created_at && new Date(p.created_at).getTime() > weekAgo
  ).length;
  const totalPnl = (tradesData.data ?? []).reduce((sum, t) => sum + Number(t.pnl || 0), 0);

  return {
    totalUsers: usersCount.count ?? 0,
    totalTrades: tradesCount.count ?? 0,
    activeUsers,
    newUsers,
    totalPnl,
  };
}

function aggregateTradesByUser(trades) {
  return (trades ?? []).reduce((acc, trade) => {
    const id = trade.user_id;
    if (!acc[id]) {
      acc[id] = { count: 0, totalPnl: 0, wins: 0, lastTrade: null };
    }
    acc[id].count += 1;
    acc[id].totalPnl += Number(trade.pnl || 0);
    if (Number(trade.pnl) > 0) acc[id].wins += 1;
    const tradeDate = trade.entry_time || trade.created_at;
    if (tradeDate && (!acc[id].lastTrade || tradeDate > acc[id].lastTrade)) {
      acc[id].lastTrade = tradeDate;
    }
    return acc;
  }, {});
}

export async function fetchAllUsers() {
  const [profilesResult, tradesResult] = await Promise.all([
    supabase.from('profiles').select('*').order('created_at', { ascending: false }),
    supabase.from('trades').select('user_id, pnl, entry_time, created_at'),
  ]);

  if (profilesResult.error) throw profilesResult.error;
  if (tradesResult.error) throw tradesResult.error;

  const byUser = aggregateTradesByUser(tradesResult.data);

  return (profilesResult.data ?? []).map((profile) => {
    const stats = byUser[profile.id] ?? { count: 0, totalPnl: 0, wins: 0, lastTrade: null };
    const winRate = stats.count > 0 ? (stats.wins / stats.count) * 100 : 0;
    return {
      ...profile,
      tradeCount: stats.count,
      totalPnl: stats.totalPnl,
      winRate,
      lastTrade: stats.lastTrade,
      trades: [{ count: stats.count }],
    };
  });
}

export async function fetchUserAdminSummary(userId) {
  const [profileResult, tradesResult] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', userId).maybeSingle(),
    supabase.from('trades').select('pnl, entry_time').eq('user_id', userId),
  ]);

  if (profileResult.error) throw profileResult.error;
  if (tradesResult.error) throw tradesResult.error;

  const trades = tradesResult.data ?? [];
  const totalPnl = trades.reduce((sum, t) => sum + Number(t.pnl || 0), 0);
  const wins = trades.filter((t) => Number(t.pnl) > 0).length;
  const losses = trades.filter((t) => Number(t.pnl) < 0).length;

  return {
    profile: profileResult.data,
    tradeCount: trades.length,
    totalPnl,
    winRate: trades.length > 0 ? (wins / trades.length) * 100 : 0,
    wins,
    losses,
  };
}
