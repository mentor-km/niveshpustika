import { supabase } from '@/lib/supabase';

const SELECT_FIELDS =
  'tradingsymbol, name, lot_size, expiry, exchange, instrument_type, strike';

/**
 * Search instrument master for autocomplete (requires instruments table + daily sync).
 */
export async function searchInstruments(segment, query) {
  const q = query?.trim();
  if (!segment || !q || q.length < 2) return [];

  const today = new Date().toISOString().slice(0, 10);
  const escaped = q.replace(/[%_\\]/g, '');

  function buildQuery({ instrumentTypes, limit = 25 }) {
    let builder = supabase
      .from('instruments')
      .select(SELECT_FIELDS)
      .eq('app_segment', segment)
      .order('tradingsymbol', { ascending: true })
      .limit(limit);

    if (segment === 'Equity') {
      builder = builder.or(`tradingsymbol.ilike.${escaped}%,name.ilike.%${escaped}%`);
    } else {
      // Derivatives: match symbol prefix only (avoids BANKNIFTY when typing NIFTY).
      builder = builder.ilike('tradingsymbol', `${escaped}%`);
    }

    if (instrumentTypes?.length === 1) {
      builder = builder.eq('instrument_type', instrumentTypes[0]);
    } else if (instrumentTypes?.length > 1) {
      builder = builder.in('instrument_type', instrumentTypes);
    }

    if (segment !== 'Equity') {
      builder = builder.gte('expiry', today);
    }

    return builder;
  }

  try {
    if (segment === 'Futures' || segment === 'Currency') {
      const { data, error } = await buildQuery({ instrumentTypes: ['FUT'] });
      if (error) throw error;
      return data ?? [];
    }

    if (segment === 'Options') {
      const { data, error } = await buildQuery({ instrumentTypes: ['CE', 'PE'] });
      if (error) throw error;
      return data ?? [];
    }

    if (segment === 'Commodities') {
      // Futures first — option strikes sort before GOLD26AUGFUT alphabetically.
      const { data: futures, error: futErr } = await buildQuery({ instrumentTypes: ['FUT'] });
      if (futErr) throw futErr;
      const futList = futures ?? [];
      if (futList.length >= 25) return futList;

      const { data: options, error: optErr } = await buildQuery({
        instrumentTypes: ['CE', 'PE'],
        limit: 25 - futList.length,
      });
      if (optErr) throw optErr;
      return [...futList, ...(options ?? [])];
    }

    const { data, error } = await buildQuery({});
    if (error) throw error;
    return data ?? [];
  } catch (error) {
    if (error.code === '42P01') {
      return [];
    }
    throw error;
  }
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
