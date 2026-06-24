import React, { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
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

  const { data: results = [], isFetching } = useQuery({
    queryKey: ['instruments', segment, query],
    queryFn: () => searchInstruments(segment, query),
    enabled: Boolean(segment) && query.trim().length >= 2,
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

  const showList = open && segment && query.trim().length >= 2;

  return (
    <div ref={wrapRef} className="relative">
      <Input
        placeholder={
          segment ? 'Start typing symbol, e.g. RELIANCE, NIFTY…' : 'Select segment first'
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
            <li className="px-3 py-2 text-sm text-slate-500">
              No matches — keep typing to use a custom symbol
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
        </ul>
      )}
    </div>
  );
}
