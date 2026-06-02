import React from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TRIAL_FEATURES = [
  'Unlimited trade logging',
  'Full detailed dashboard',
  'All segment analytics',
  'PWA install on mobile',
  'Profile & account management',
];

export function LandingPricing() {
  return (
    <section id="pricing" className="py-16 lg:py-24 bg-emerald-50/60">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-emerald-600 font-semibold text-sm uppercase tracking-wide mb-3">Pricing</p>
          <h2 className="font-heading text-3xl lg:text-4xl font-bold text-slate-900">
            Start free. Upgrade when you&apos;re ready.
          </h2>
          <p className="mt-4 text-slate-600">
            Explore the full product during your trial. Subscription plans for continued access coming soon.
          </p>
        </div>

        <div className="max-w-lg mx-auto">
          <div className="rounded-3xl bg-white border-2 border-emerald-500 shadow-xl shadow-emerald-900/10 overflow-hidden">
            <div className="bg-emerald-600 px-8 py-6 text-white text-center">
              <p className="text-emerald-100 text-sm font-medium">Most popular</p>
              <h3 className="font-heading text-2xl font-bold mt-1">7-Day Free Trial</h3>
              <p className="mt-2 text-4xl font-extrabold">₹0</p>
              <p className="text-emerald-100 text-sm mt-1">No credit card required</p>
            </div>
            <div className="p-8">
              <ul className="space-y-3">
                {TRIAL_FEATURES.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-slate-700">
                    <Check className="h-5 w-5 text-emerald-600 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                asChild
                size="lg"
                className="w-full mt-8 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold h-12"
              >
                <Link to="/app">Start Free Trial</Link>
              </Button>
              <p className="text-center text-xs text-slate-500 mt-4">
                After trial: add trades + basic dashboard free · full analytics with subscription
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
