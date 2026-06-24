import { supabase } from '@/lib/supabase';

/**
 * Search instrument master for autocomplete (requires instruments table + daily sync).
 */
export async function searchInstruments(segment, query) {
  const q = query?.trim();
  if (!segment || !q || q.length < 2) return [];

  const today = new Date().toISOString().slice(0, 10);
  const escaped = q.replace(/[%_\\]/g, '');

  let builder = supabase
    .from('instruments')
    .select('tradingsymbol, name, lot_size, expiry, exchange, instrument_type, strike')
    .eq('app_segment', segment)
    .or(`tradingsymbol.ilike.${escaped}%,name.ilike.%${escaped}%`)
    .order('tradingsymbol', { ascending: true })
    .limit(25);

  if (segment === 'Futures') {
    builder = builder.eq('instrument_type', 'FUT').gte('expiry', today);
  } else if (segment === 'Options') {
    builder = builder.in('instrument_type', ['CE', 'PE']).gte('expiry', today);
  } else if (segment === 'Currency' || segment === 'Commodities') {
    builder = builder.gte('expiry', today);
  }

  const { data, error } = await builder;
  if (error) {
    if (error.code === '42P01') {
      return [];
    }
    throw error;
  }
  return data ?? [];
}

export function formatInstrumentLabel(inst) {
  if (!inst) return '';
  const parts = [inst.tradingsymbol];
  if (inst.name && inst.name !== inst.tradingsymbol) {
    parts.push(inst.name);
  }
  if (inst.expiry) {
    parts.push(inst.expiry);
  }
  if (inst.strike) {
    parts.push(String(inst.strike));
  }
  if (inst.lot_size && inst.instrument_type !== 'EQ') {
    parts.push(`lot ${inst.lot_size}`);
  }
  return parts.join(' · ');
}
