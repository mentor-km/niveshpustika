/**
 * Downloads Kite instruments CSV and upserts into Supabase.
 *
 * Env (in .env.local or shell):
 *   SUPABASE_URL  — or VITE_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY  — service_role secret (NOT the anon key)
 *
 * Run: npm run sync-instruments
 */

import { readFileSync, existsSync } from 'fs';
import { createClient } from '@supabase/supabase-js';

const KITE_INSTRUMENTS_URL = 'https://api.kite.trade/instruments';
const BATCH_SIZE = 500;

const APP_SEGMENTS = ['Equity', 'Futures', 'Options', 'Currency', 'Commodities'];

const ENV_OVERRIDE_KEYS = new Set([
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
]);

/** .env.local wins over stale shell variables (common on Windows). */
function loadEnvFiles() {
  for (const file of ['.env.local', '.env']) {
    if (!existsSync(file)) continue;
    const text = readFileSync(file, 'utf8').replace(/^\uFEFF/, '');
    for (const line of text.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      value = value.replace(/[\r\n\uFEFF]/g, '').trim();
      if (ENV_OVERRIDE_KEYS.has(key) || process.env[key] === undefined) {
        process.env[key] = value;
      }
    }
  }
}

function sanitizeApiKey(key) {
  return key.replace(/[\s\r\n\uFEFF"']/g, '');
}

function decodeJwtRole(key) {
  try {
    const payload = key.split('.')[1];
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
    const json = JSON.parse(Buffer.from(padded, 'base64').toString('utf8'));
    return json.role;
  } catch {
    return null;
  }
}

function resolveSupabaseConfig() {
  loadEnvFiles();

  const url = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').trim();
  const serviceKey = sanitizeApiKey(process.env.SUPABASE_SERVICE_ROLE_KEY || '');
  const anonKey = sanitizeApiKey(process.env.VITE_SUPABASE_ANON_KEY || '');

  if (!url) {
    console.error(
      'Missing Supabase URL.\n' +
        'Add SUPABASE_URL or VITE_SUPABASE_URL to .env.local'
    );
    process.exit(1);
  }

  if (!serviceKey) {
    console.error(
      'Missing SUPABASE_SERVICE_ROLE_KEY in .env.local\n\n' +
        'The sync script cannot use VITE_SUPABASE_ANON_KEY (read-only for clients).\n' +
        'Get the service_role key from:\n' +
        '  Supabase Dashboard → Project Settings → API → service_role (secret)\n\n' +
        'Add to .env.local (never commit this file):\n' +
        '  SUPABASE_SERVICE_ROLE_KEY=eyJ...\n'
    );
    process.exit(1);
  }

  if (anonKey && serviceKey === anonKey) {
    console.error(
      'SUPABASE_SERVICE_ROLE_KEY must be the service_role key, not the anon key.\n' +
        'Use the separate "service_role" secret from Supabase → Settings → API.'
    );
    process.exit(1);
  }

  const role = decodeJwtRole(serviceKey);
  if (role && role !== 'service_role') {
    console.error(`Expected service_role JWT but got role "${role}".`);
    process.exit(1);
  }

  return { url, serviceKey };
}

async function verifySupabaseConnection(supabase, url, serviceKey) {
  const { error } = await supabase.from('instruments').select('id').limit(1);
  if (error?.message?.includes('Invalid API key')) {
    const role = decodeJwtRole(serviceKey);
    console.error(
      'Supabase rejected the API key.\n\n' +
        `  Project URL: ${url}\n` +
        `  JWT role in key: ${role ?? 'could not decode'}\n` +
        `  Key length: ${serviceKey.length} chars (expect ~200+)\n\n` +
        'Fix:\n' +
        '  1. Close terminal and open a new one (clears stale $env:SUPABASE_* vars)\n' +
        '  2. Supabase Dashboard → Settings → API → copy service_role again (Reveal)\n' +
        '  3. Paste into .env.local as SUPABASE_SERVICE_ROLE_KEY=... (no quotes, one line)\n' +
        '  4. Do not run: $env:SUPABASE_SERVICE_ROLE_KEY=... unless the value is exact'
    );
    throw new Error('Invalid Supabase API key');
  }
  if (error?.code === '42P01') {
    throw new Error('Table "instruments" not found. Run supabase/instruments.sql in SQL Editor first.');
  }
  if (error) throw error;
}

function parseCsvLine(line) {
  const fields = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }
    if (char === ',' && !inQuotes) {
      fields.push(current);
      current = '';
      continue;
    }
    current += char;
  }
  fields.push(current);
  return fields;
}

function toAppSegment({ exchange, segment, instrument_type }) {
  const ex = (exchange || '').toUpperCase();
  const seg = (segment || '').toUpperCase();
  const typ = (instrument_type || '').toUpperCase();

  if (typ === 'EQ' && (ex === 'NSE' || ex === 'BSE')) {
    return 'Equity';
  }

  const isMcx = ex === 'MCX' || seg === 'MCX';
  const isCds = ex === 'CDS' || seg === 'CDS';
  const isNfo = ex === 'NFO' || seg === 'NFO';
  const isBfo = ex === 'BFO' || seg === 'BFO';

  if (typ === 'FUT') {
    if (isMcx) return 'Commodities';
    if (isCds) return 'Currency';
    if (isNfo || isBfo) return 'Futures';
    return null;
  }
  if (typ === 'CE' || typ === 'PE') {
    if (isMcx) return 'Commodities';
    if (isCds) return 'Currency';
    if (isNfo || isBfo) return 'Options';
    return null;
  }
  return null;
}

function parseExpiry(value) {
  if (!value || value.trim() === '') return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10);
}

function rowToRecord(headers, line) {
  const cols = parseCsvLine(line);
  const row = Object.fromEntries(headers.map((h, i) => [h, cols[i] ?? '']));

  const app_segment = toAppSegment(row);
  if (!app_segment || !APP_SEGMENTS.includes(app_segment)) return null;

  const lotSize = parseInt(row.lot_size, 10);
  const strike = row.strike ? parseFloat(row.strike) : null;

  return {
    exchange: row.exchange,
    tradingsymbol: row.tradingsymbol,
    name: row.name || row.tradingsymbol,
    app_segment,
    instrument_type: row.instrument_type,
    expiry: parseExpiry(row.expiry),
    strike: strike && !Number.isNaN(strike) ? strike : null,
    lot_size: Number.isNaN(lotSize) ? null : lotSize,
    tick_size: row.tick_size ? parseFloat(row.tick_size) : null,
    synced_at: new Date().toISOString(),
  };
}

async function fetchCsv() {
  const res = await fetch(KITE_INSTRUMENTS_URL, {
    headers: { 'User-Agent': 'NiveshPustika/1.0 (instrument-sync)' },
  });
  if (!res.ok) {
    throw new Error(`Failed to download Kite instruments: ${res.status} ${res.statusText}`);
  }
  return res.text();
}

async function upsertBatch(supabase, batch) {
  const { error } = await supabase.from('instruments').upsert(batch, {
    onConflict: 'exchange,tradingsymbol',
  });
  if (error) {
    if (error.message?.includes('Invalid API key')) {
      throw new Error(
        'Invalid API key — use SUPABASE_SERVICE_ROLE_KEY from Supabase → Settings → API → service_role (not anon).'
      );
    }
    if (error.code === '42P01') {
      throw new Error(
        'Table "instruments" not found. Run supabase/instruments.sql in the SQL Editor first.'
      );
    }
    throw error;
  }
}

async function main() {
  const { url, serviceKey } = resolveSupabaseConfig();
  const supabase = createClient(url, serviceKey);

  console.log('Checking Supabase connection…');
  await verifySupabaseConnection(supabase, url, serviceKey);

  console.log('Downloading Kite instruments CSV…');
  const csv = await fetchCsv();
  const lines = csv.split('\n').filter((l) => l.trim());
  const headers = parseCsvLine(lines[0]);

  let batch = [];
  let total = 0;
  let skipped = 0;

  for (let i = 1; i < lines.length; i++) {
    const record = rowToRecord(headers, lines[i]);
    if (!record) {
      skipped += 1;
      continue;
    }
    batch.push(record);
    if (batch.length >= BATCH_SIZE) {
      await upsertBatch(supabase, batch);
      total += batch.length;
      console.log(`Upserted ${total} instruments…`);
      batch = [];
    }
  }

  if (batch.length) {
    await upsertBatch(supabase, batch);
    total += batch.length;
  }

  console.log(`Done. Upserted ${total} instruments, skipped ${skipped} rows.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
