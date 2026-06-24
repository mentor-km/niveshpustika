import React from 'react';
import { Turnstile } from '@marsidev/react-turnstile';

export const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || '';

export function isTurnstileEnabled() {
  return Boolean(TURNSTILE_SITE_KEY);
}

export default function TurnstileWidget({ onSuccess, onExpire, onError }) {
  if (!isTurnstileEnabled()) return null;

  return (
    <div className="flex justify-center min-h-[65px]">
      <Turnstile
        siteKey={TURNSTILE_SITE_KEY}
        onSuccess={onSuccess}
        onExpire={onExpire}
        onError={onError}
        options={{
          theme: 'light',
          size: 'normal',
        }}
      />
    </div>
  );
}
