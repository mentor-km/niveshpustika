import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { useQuery } from '@tanstack/react-query';
import { Loader2, PenLine } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { searchInstruments, formatInstrumentLabel } from '@/lib/instruments';

const inputClass = 'bg-white border-teal-200 text-slate-800 text-base md:text-sm';
const GAP = 4;
const MIN_LIST_HEIGHT = 120;
const MAX_LIST_HEIGHT = 288;

function preventInputBlur(e) {
  e.preventDefault();
}

function computeListLayout(inputEl) {
  if (!inputEl) return null;

  const rect = inputEl.getBoundingClientRect();
  const viewport = window.visualViewport;
  const vpTop = viewport?.offsetTop ?? 0;
  const vpHeight = viewport?.height ?? window.innerHeight;
  const vpBottom = vpTop + vpHeight;

  const spaceBelow = vpBottom - rect.bottom - GAP;
  const spaceAbove = rect.top - vpTop - GAP;
  const openBelow = spaceBelow >= spaceAbove;
  const available = Math.max(openBelow ? spaceBelow : spaceAbove, MIN_LIST_HEIGHT);
  const maxHeight = Math.min(MAX_LIST_HEIGHT, Math.max(MIN_LIST_HEIGHT, available));
  const top = openBelow
    ? rect.bottom + GAP
    : Math.max(vpTop + GAP, rect.top - maxHeight - GAP);

  return {
    position: 'fixed',
    top,
    left: rect.left,
    width: rect.width,
    maxHeight,
    zIndex: 9999,
    pointerEvents: 'auto',
  };
}

const SymbolSearch = forwardRef(function SymbolSearch(
  { segment, value, onChange, onSelectInstrument, disabled },
  ref
) {
  const [query, setQuery] = useState(value || '');
  const [open, setOpen] = useState(false);
  const [listStyle, setListStyle] = useState(null);
  const wrapRef = useRef(null);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const close = useCallback(() => setOpen(false), []);

  useImperativeHandle(ref, () => ({ close }), [close]);

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

  const updateListPosition = useCallback(() => {
    if (!inputRef.current) return;
    setListStyle(computeListLayout(inputRef.current));
  }, []);

  useEffect(() => {
    const onDocPointer = (e) => {
      const target = e.target;
      if (wrapRef.current?.contains(target) || listRef.current?.contains(target)) return;
      setOpen(false);
    };
    document.addEventListener('mousedown', onDocPointer);
    document.addEventListener('touchstart', onDocPointer, { passive: true });
    return () => {
      document.removeEventListener('mousedown', onDocPointer);
      document.removeEventListener('touchstart', onDocPointer);
    };
  }, []);

  const showList = open && segment && trimmedQuery.length >= 2;

  useEffect(() => {
    if (!showList) {
      setListStyle(null);
      return undefined;
    }
    updateListPosition();
    window.addEventListener('scroll', updateListPosition, true);
    window.addEventListener('resize', updateListPosition);
    const viewport = window.visualViewport;
    if (viewport) {
      viewport.addEventListener('resize', updateListPosition);
      viewport.addEventListener('scroll', updateListPosition);
    }
    return () => {
      window.removeEventListener('scroll', updateListPosition, true);
      window.removeEventListener('resize', updateListPosition);
      if (viewport) {
        viewport.removeEventListener('resize', updateListPosition);
        viewport.removeEventListener('scroll', updateListPosition);
      }
    };
  }, [showList, updateListPosition, results.length, isFetching]);

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

  const selectInstrument = (inst) => {
    setQuery(inst.tradingsymbol);
    onChange(inst.tradingsymbol);
    onSelectInstrument?.(inst);
    setOpen(false);
  };

  const stopScrollPropagation = (e) => {
    e.stopPropagation();
  };

  const handleFocus = () => {
    setOpen(true);
    requestAnimationFrame(() => {
      inputRef.current?.scrollIntoView({ block: 'center', inline: 'nearest' });
      updateListPosition();
    });
  };

  const dropdown = showList && listStyle && (
    <ul
      ref={listRef}
      data-symbol-search-dropdown
      style={{ ...listStyle, overscrollBehavior: 'contain', touchAction: 'pan-y' }}
      className="overflow-y-auto rounded-md border border-teal-200 bg-white shadow-lg pointer-events-auto"
      onWheel={stopScrollPropagation}
      onTouchMove={stopScrollPropagation}
    >
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
            className="w-full text-left px-3 py-2 hover:bg-teal-50 active:bg-teal-100 border-b border-teal-50 last:border-0"
            onPointerDown={(e) => {
              preventInputBlur(e);
              selectInstrument(inst);
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
            className="w-full text-left px-3 py-2.5 hover:bg-teal-50 active:bg-teal-100 bg-teal-50/50 flex items-start gap-2"
            onPointerDown={(e) => {
              preventInputBlur(e);
              acceptManualSymbol();
            }}
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
  );

  return (
    <div ref={wrapRef} className="relative">
      <Input
        ref={inputRef}
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
        onFocus={handleFocus}
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
        autoCorrect="off"
        autoCapitalize="characters"
        spellCheck={false}
      />
      {dropdown && createPortal(dropdown, document.body)}
    </div>
  );
});

export default SymbolSearch;
