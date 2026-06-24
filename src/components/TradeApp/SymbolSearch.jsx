import React, { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2, PenLine } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { searchInstruments, formatInstrumentLabel } from '@/lib/instruments';

const inputClass = 'bg-white border-teal-200 text-slate-800';

export default function SymbolSearch({ segment, value, onChange, onSelectInstrument, disabled }) {
  const [query, setQuery] = useState(value || '');
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    setQuery(value || '');
  }, [value]);

  const trimmedQuery = query.trim();
  const { data: results = [], isFetching } = useQuery({
    queryKey: ['instruments', segment, trimmedQuery],
    queryFn: () => searchInstruments(segment, trimmedQuery),
    enabled: Boolean(segment) && trimmedQuery.length >= 2,
    staleTime: 60_000,
  });

  useEffect(() => {
    const onDocClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const showList = open && segment && trimmedQuery.length >= 2;
  const exactMatch = results.some(
    (inst) => inst.tradingsymbol.toUpperCase() === trimmedQuery.toUpperCase()
  );
  const showManualEntry =
    trimmedQuery.length >= 1 && !exactMatch && (!isFetching || results.length === 0);

  const acceptManualSymbol = () => {
    const symbol = trimmedQuery.toUpperCase();
    setQuery(symbol);
    onChange(symbol);
    setOpen(false);
  };

  return (
    <div ref={wrapRef} className="relative">
      <Input
        placeholder={
          segment
            ? 'Symbol — e.g. RELIANCE, NIFTY, GOLD CE (manual entry OK)'
            : 'Select segment first'
        }
        className={`${inputClass} uppercase`}
        value={query}
        disabled={disabled || !segment}
        onChange={(e) => {
          const v = e.target.value.toUpperCase();
          setQuery(v);
          onChange(v);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            acceptManualSymbol();
          }
          if (e.key === 'Escape') {
            setOpen(false);
          }
        }}
        autoComplete="off"
      />
      {showList && (
        <ul className="absolute z-50 mt-1 w-full max-h-56 overflow-y-auto rounded-md border border-teal-200 bg-white shadow-lg">
          {isFetching && (
            <li className="flex justify-center py-4">
              <Loader2 className="h-5 w-5 animate-spin text-[#2d8b8b]" />
            </li>
          )}
          {!isFetching && results.length === 0 && (
            <li className="px-3 py-2 text-sm text-slate-500 border-b border-teal-50">
              No suggestions — you can still log this trade with your symbol below.
            </li>
          )}
          {results.map((inst) => (
            <li key={`${inst.exchange}-${inst.tradingsymbol}`}>
              <button
                type="button"
                className="w-full text-left px-3 py-2 hover:bg-teal-50 border-b border-teal-50 last:border-0"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  setQuery(inst.tradingsymbol);
                  onChange(inst.tradingsymbol);
                  onSelectInstrument?.(inst);
                  setOpen(false);
                }}
              >
                <span className="block font-medium text-slate-800 text-sm">{inst.tradingsymbol}</span>
                <span className="block text-xs text-slate-500 truncate">
                  {formatInstrumentLabel(inst)}
                </span>
              </button>
            </li>
          ))}
          {showManualEntry && (
            <li>
              <button
                type="button"
                className="w-full text-left px-3 py-2.5 hover:bg-teal-50 bg-teal-50/50 flex items-start gap-2"
                onMouseDown={(e) => e.preventDefault()}
                onClick={acceptManualSymbol}
              >
                <PenLine className="h-4 w-4 text-[#2d8b8b] mt-0.5 shrink-0" />
                <span>
                  <span className="block font-medium text-slate-800 text-sm">
                    Use &ldquo;{trimmedQuery.toUpperCase()}&rdquo;
                  </span>
                  <span className="block text-xs text-slate-500">
                    Log trade with this symbol — lot size can be entered manually
                  </span>
                </span>
              </button>
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
