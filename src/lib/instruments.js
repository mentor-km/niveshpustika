import { supabase } from '@/lib/supabase';

const SELECT_FIELDS =
  'tradingsymbol, name, lot_size, expiry, exchange, instrument_type, strike';

const TYPE_ALIASES = {
  CE: 'CE',
  PE: 'PE',
  CALL: 'CE',
  PUT: 'PE',
  C: 'CE',
  P: 'PE',
  FUT: 'FUT',
  FUTURE: 'FUT',
  FUTURES: 'FUT',
};

/** Parse queries like "Gold CE", "Nifty FUT", "USDINR PE". */
export function parseInstrumentQuery(raw) {
  const trimmed = raw?.trim().toUpperCase() ?? '';
  const tokens = trimmed.split(/\s+/).filter(Boolean);
  if (!tokens.length) {
    return { underlying: '', instrumentType: null, compact: '' };
  }

  let instrumentType = null;
  const last = tokens[tokens.length - 1];
  if (TYPE_ALIASES[last]) {
    instrumentType = TYPE_ALIASES[last];
    tokens.pop();
  }

  const underlying = tokens.join('').replace(/[%_\\]/g, '');
  const compact = trimmed.replace(/\s+/g, '').replace(/[%_\\]/g, '');

  return { underlying, instrumentType, compact };
}

function applySymbolFilter(builder, segment, parsed) {
  const { underlying, instrumentType, compact } = parsed;

  if (segment === 'Equity') {
    const term = (underlying || compact).replace(/[%_\\]/g, '');
    if (!term) return builder;
    return builder.or(`tradingsymbol.ilike.${term}%,name.ilike.%${term}%`);
  }

  if (underlying && instrumentType) {
    return builder.ilike('tradingsymbol', `%${underlying}%`);
  }

  const term = underlying || compact;
  if (!term) return builder;

  // Single token: prefix match (NIFTY → NIFTY26JUNFUT, not BANKNIFTY).
  return builder.ilike('tradingsymbol', `${term}%`);
}

function resolveInstrumentTypes(segment, parsedType) {
  if (parsedType === 'CE' || parsedType === 'PE') return [parsedType];
  if (parsedType === 'FUT') return ['FUT'];
  if (segment === 'Futures' || segment === 'Currency') return ['FUT'];
  if (segment === 'Options') return ['CE', 'PE'];
  return null;
}

/**
 * Search instrument master for autocomplete (requires instruments table + daily sync).
 */
export async function searchInstruments(segment, query) {
  const q = query?.trim();
  if (!segment || !q || q.length < 2) return [];

  const today = new Date().toISOString().slice(0, 10);
  const parsed = parseInstrumentQuery(q);

  function buildQuery({ instrumentTypes, limit = 25 }) {
    let builder = supabase
      .from('instruments')
      .select(SELECT_FIELDS)
      .eq('app_segment', segment)
      .order('tradingsymbol', { ascending: true })
      .limit(limit);

    builder = applySymbolFilter(builder, segment, parsed);

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

  const explicitTypes = resolveInstrumentTypes(segment, parsed.instrumentType);

  try {
    if (segment === 'Commodities' && !parsed.instrumentType) {
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

    if (explicitTypes?.length === 1) {
      const { data, error } = await buildQuery({ instrumentTypes: explicitTypes });
      if (error) throw error;
      return data ?? [];
    }

    if (explicitTypes?.length > 1) {
      const { data, error } = await buildQuery({ instrumentTypes: explicitTypes });
      if (error) throw error;
      return data ?? [];
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
