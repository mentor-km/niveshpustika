import React from 'react';

export function Logo({ className = 'h-10 w-auto', showText = true, textClassName = '' }) {
  return (
    <div className={`flex items-center gap-3 ${showText ? '' : ''}`}>
      <img
        src="/logo.png"
        alt="Nivesh Pustika"
        className={`${className} object-contain`}
      />
      {showText && (
        <span className={`font-heading font-bold text-lg sm:text-xl text-emerald-900 ${textClassName}`}>
          Nivesh Pustika
        </span>
      )}
    </div>
  );
}
