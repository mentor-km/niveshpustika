export const SYMBOL_SEARCH_DROPDOWN_SELECTOR = '[data-symbol-search-dropdown]';

export function isSymbolSearchDropdownTarget(target) {
  return Boolean(target?.closest?.(SYMBOL_SEARCH_DROPDOWN_SELECTOR));
}
