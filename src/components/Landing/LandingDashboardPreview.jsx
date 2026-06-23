import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const METRICS = [
  'Equity curve & cumulative P&L',
  'Win vs loss & profit factor',
  'P&L breakdown by segment',
  'Top winners & worst losers',
  'Monthly performance table',
  'Profile & account management',
];

export function LandingDashboardPreview() {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="order-2 lg:order-1 rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-4 lg:p-6 shadow-xl">
            <div className="rounded-xl bg-white border border-slate-100 overflow-hidden">
              <div className="bg-emerald-600 px-4 py-3 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-300" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-200" />
                </div>
                <span className="text-sm text-emerald-100 ml-2">Dashboard — Nivesh Pustika</span>
              </div>
              <div className="p-4 grid grid-cols-2 gap-3">
                {['Net P&L', 'Win Rate', 'Trades', 'R:R'].map((label, i) => (
                  <div key={label} className="rounded-lg bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">{label}</p>
                    <p className={`font-bold ${i === 0 ? 'text-emerald-600' : 'text-slate-800'}`}>
                      {['+₹18,420', '64.2%', '87', '1.6'][i]}
                    </p>
                  </div>
                ))}
              </div>
              <div className="px-4 pb-4">
                <div className="h-24 rounded-lg bg-emerald-50 border border-emerald-100 flex items-end gap-1 p-2">
                  {[30, 45, 38, 55, 48, 62, 58, 72, 68, 80].map((h, i) => (
                    <div key={i} className="flex-1 bg-emerald-500 rounded-t opacity-80" style={{ height: `${h}%` }} />
                  ))}
                </div>
                <p className="text-xs text-center text-slate-400 mt-2">Equity curve preview</p>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <p className="text-emerald-600 font-semibold text-sm uppercase tracking-wide mb-3">Dashboard</p>
            <h2 className="font-heading text-3xl lg:text-4xl font-bold text-slate-900">
              See the full picture of your trading
            </h2>
            <p className="mt-4 text-slate-600 leading-relaxed">
              Stop guessing. Nivesh Pustika turns raw trade logs into clear analytics so you know
              what&apos;s working — and what to cut.
            </p>
            <ul className="mt-8 space-y-3">
              {METRICS.map((item) => (
                <li key={item} className="flex items-start gap-3 text-slate-700">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
            <Button asChild className="mt-8 bg-emerald-600 hover:bg-emerald-700 text-white">
              <Link to="/app">Open your dashboard</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
