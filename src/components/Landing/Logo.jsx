import React from 'react';
import { cn } from '@/lib/utils';

export function Logo({
  className = 'h-10 w-10',
  showText = true,
  textClassName = '',
  variant = 'light',
}) {
  return (
    <div className="flex items-center gap-3">
      <img
        src="/logo.png"
        alt="Nivesh Pustika"
        className={cn(
          'object-contain shrink-0 rounded-[0.65rem]',
          variant === 'light' && 'shadow-md shadow-teal-900/10 ring-1 ring-teal-200/50',
          variant === 'dark' && 'shadow-lg shadow-teal-900/20 ring-1 ring-teal-300/30',
          className
        )}
      />
      {showText && (
        <span
          className={cn(
            'font-heading font-bold text-lg sm:text-xl',
            variant === 'light' ? 'text-slate-800' : 'text-teal-950',
            textClassName
          )}
        >
          Nivesh Pustika
        </span>
      )}
    </div>
  );
}
