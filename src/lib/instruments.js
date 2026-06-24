import { supabase } from '@/lib/supabase';

const SELECT_FIELDS =
  'tradingsymbol, name, lot_size, expiry, exchange, instrument_type, strike';

const DERIVATIVE_FETCH_LIMIT = 150;
const DERIVATIVE_RESULT_LIMIT = 50;

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

/** Kite CSV reports lot_size=1 for many MCX/CDS contracts; map to traded units per lot. */
export function resolveEffectiveLotSize(inst) {
  if (!inst) return null;

  const raw = Number(inst.lot_size);
  if (Number.isFinite(raw) && raw > 1) return raw;

  const sym = (inst.tradingsymbol || '').toUpperCase();
  const ex = (inst.exchange || '').toUpperCase();

  if (ex === 'CDS') {
    if (sym.startsWith('JPYINR')) return 100000;
    if (/^(USDINR|EURINR|GBPINR|CHFINR)/.test(sym)) return 1000;
  }

  if (ex === 'MCX') {
    if (sym.startsWith('GOLDM')) return 100;
    if (sym.startsWith('GOLDPETAL')) return 1;
    if (sym.startsWith('GOLDGUINEA')) return 8;
    if (sym.startsWith('GOLDTEN')) return 10;
    if (sym.startsWith('GOLD')) return 1000;
    if (sym.startsWith('CRUDEOILM')) return 10;
    if (sym.startsWith('CRUDEOIL')) return 100;
    if (sym.startsWith('SILVERM')) return 5;
    if (sym.startsWith('SILVER')) return 30;
    if (sym.startsWith('NATURALGAS')) return 1250;
    if (sym.startsWith('COPPER')) return 2500;
    if (sym.startsWith('ZINC')) return 5000;
    if (sym.startsWith('LEAD')) return 5000;
    if (sym.startsWith('ALUMINIUM') || sym.startsWith('ALUMINUM')) return 5000;
  }

  return Number.isFinite(raw) ? raw : null;
}

function enrichInstrument(inst) {
  const lot_size = resolveEffectiveLotSize(inst);
  if (lot_size == null || lot_size === inst.lot_size) return inst;
  return { ...inst, lot_size };
}

function enrichInstruments(rows) {
  return (rows ?? []).map(enrichInstrument);
}

function sortByExpiryThenSymbol(a, b) {
  const expA = a.expiry || '9999-12-31';
  const expB = b.expiry || '9999-12-31';
  if (expA !== expB) return expA.localeCompare(expB);

  const strikeA = a.strike ?? 0;
  const strikeB = b.strike ?? 0;
  if (strikeA !== strikeB) return strikeA - strikeB;

  return a.tradingsymbol.localeCompare(b.tradingsymbol);
}

/** Surface nearest expiries first instead of one month filling the whole list. */
export function spreadByExpiry(rows, limit = DERIVATIVE_RESULT_LIMIT) {
  const sorted = [...rows].sort(sortByExpiryThenSymbol);
  const buckets = new Map();

  for (const row of sorted) {
    const key = row.expiry || 'unknown';
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key).push(row);
  }

  const expiryOrder = [...buckets.keys()].sort();
  const out = [];
  let round = 0;

  while (out.length < limit) {
    let added = false;
    for (const exp of expiryOrder) {
      const bucket = buckets.get(exp);
      if (round < bucket.length) {
        out.push(bucket[round]);
        added = true;
        if (out.length >= limit) break;
      }
    }
    if (!added) break;
    round += 1;
  }

  return out;
}

function finalizeDerivativeResults(rows, { spreadOptions = false } = {}) {
  const sorted = [...rows].sort(sortByExpiryThenSymbol);
  const limited = spreadOptions
    ? spreadByExpiry(sorted, DERIVATIVE_RESULT_LIMIT)
    : sorted.slice(0, DERIVATIVE_RESULT_LIMIT);
  return enrichInstruments(limited);
}

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

  return builder.ilike('tradingsymbol', `${term}%`);
}

function resolveInstrumentTypes(segment, parsedType) {
  if (parsedType === 'CE' || parsedType === 'PE') return [parsedType];
  if (parsedType === 'FUT') return ['FUT'];
  if (segment === 'Futures' || segment === 'Currency') return ['FUT'];
  if (segment === 'Options') return ['CE', 'PE'];
  return null;
}

/** Lower score = better match. Symbol prefix beats name-only (e.g. mutual funds). */
export function scoreEquityMatch(term, inst) {
  const sym = (inst.tradingsymbol || '').toUpperCase();
  const name = (inst.name || '').toUpperCase();
  const t = term.toUpperCase();

  let score;
  if (sym === t) score = 0;
  else if (sym.startsWith(t)) score = 10 + Math.min(sym.length - t.length, 40);
  else if (name.startsWith(t)) score = 100;
  else if (name.includes(t)) score = 200 + name.indexOf(t);
  else score = 999;

  if (inst.exchange === 'NSE') score -= 0.25;
  return score;
}

function dedupeInstruments(rows, seen = new Set()) {
  const out = [];
  for (const row of rows ?? []) {
    const key = `${row.exchange}-${row.tradingsymbol}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(row);
  }
  return out;
}

async function searchEquity(parsed, limit = 25) {
  const term = (parsed.underlying || parsed.compact).replace(/[%_\\]/g, '');
  if (!term) return [];

  const seen = new Set();
  const merged = [];

  const { data: bySymbol, error: symErr } = await supabase
    .from('instruments')
    .select(SELECT_FIELDS)
    .eq('app_segment', 'Equity')
    .ilike('tradingsymbol', `${term}%`)
    .order('tradingsymbol', { ascending: true })
    .limit(limit);

  if (symErr) throw symErr;
  merged.push(...dedupeInstruments(bySymbol, seen));

  if (merged.length < limit) {
    const { data: byName, error: nameErr } = await supabase
      .from('instruments')
      .select(SELECT_FIELDS)
      .eq('app_segment', 'Equity')
      .ilike('name', `%${term}%`)
      .order('tradingsymbol', { ascending: true })
      .limit(limit * 2);

    if (nameErr) throw nameErr;
    merged.push(...dedupeInstruments(byName, seen));
  }

  return merged
    .sort((a, b) => {
      const diff = scoreEquityMatch(term, a) - scoreEquityMatch(term, b);
      if (diff !== 0) return diff;
      return a.tradingsymbol.localeCompare(b.tradingsymbol);
    })
    .slice(0, limit);
}

/**
 * Search instrument master for autocomplete (requires instruments table + daily sync).
 */
export async function searchInstruments(segment, query) {
  const q = query?.trim();
  if (!segment || !q || q.length < 2) return [];

  const today = new Date().toISOString().slice(0, 10);
  const parsed = parseInstrumentQuery(q);

  function buildQuery({ instrumentTypes, limit = DERIVATIVE_FETCH_LIMIT }) {
    let builder = supabase
      .from('instruments')
      .select(SELECT_FIELDS)
      .eq('app_segment', segment)
      .order('expiry', { ascending: true, nullsFirst: false })
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
  const isOptionLike =
    segment === 'Options' ||
    parsed.instrumentType === 'CE' ||
    parsed.instrumentType === 'PE' ||
    (segment === 'Commodities' &&
      (parsed.instrumentType === 'CE' || parsed.instrumentType === 'PE'));

  try {
    if (segment === 'Equity') {
      return await searchEquity(parsed);
    }

    if (segment === 'Commodities' && !parsed.instrumentType) {
      const { data: futures, error: futErr } = await buildQuery({ instrumentTypes: ['FUT'] });
      if (futErr) throw futErr;
      const futList = finalizeDerivativeResults(futures ?? [], { spreadOptions: false });

      const { data: options, error: optErr } = await buildQuery({ instrumentTypes: ['CE', 'PE'] });
      if (optErr) throw optErr;
      const optList = finalizeDerivativeResults(options ?? [], { spreadOptions: true });

      const seen = new Set(futList.map((r) => `${r.exchange}-${r.tradingsymbol}`));
      const merged = [
        ...futList,
        ...optList.filter((r) => !seen.has(`${r.exchange}-${r.tradingsymbol}`)),
      ];
      return merged.slice(0, DERIVATIVE_RESULT_LIMIT);
    }

    if (explicitTypes?.length >= 1) {
      const { data, error } = await buildQuery({ instrumentTypes: explicitTypes });
      if (error) throw error;
      return finalizeDerivativeResults(data ?? [], { spreadOptions: isOptionLike });
    }

    const { data, error } = await buildQuery({});
    if (error) throw error;
    return finalizeDerivativeResults(data ?? [], { spreadOptions: false });
  } catch (error) {
    if (error.code === '42P01') {
      return [];
    }
    throw error;
  }
}

export function formatInstrumentLabel(inst) {
  if (!inst) return '';
  const lotSize = resolveEffectiveLotSize(inst);
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
  if (lotSize && inst.instrument_type !== 'EQ') {
    parts.push(`lot ${lotSize}`);
  }
  return parts.join(' · ');
}
