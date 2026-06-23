import React from 'react';
import {
  BookOpen,
  BarChart3,
  LineChart,
  Layers,
  Download,
  Bell,
} from 'lucide-react';

const FEATURES = [
  {
    icon: BookOpen,
    title: 'Structured trade logging',
    desc: 'Symbol, entry/exit, quantity, direction, timestamps & auto P&L — in under a minute.',
  },
  {
    icon: BarChart3,
    title: 'Detailed dashboard',
    desc: 'Win rate, profit factor, equity curve, segment breakdown & monthly summaries at a glance.',
  },
  {
    icon: LineChart,
    title: 'Performance analytics',
    desc: 'Spot your best setups, worst drawdowns, and which segments actually make you money.',
  },
  {
    icon: Layers,
    title: 'Segment-wise filters',
    desc: 'Slice your history by Equity, Futures, Options, Currency or MCX Commodities.',
  },
  {
    icon: Download,
    title: 'Install as PWA',
    desc: 'Add to your phone home screen from the sign-in page — use it like a native app.',
  },
  {
    icon: Bell,
    title: 'Standard plan for all',
    desc: 'Full access to log trades, dashboard, and analytics. No payments or subscriptions.',
  },
];

export function LandingFeatures() {
  return (
    <section id="features" className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-emerald-600 font-semibold text-sm uppercase tracking-wide mb-3">Features</p>
          <h2 className="font-heading text-3xl lg:text-4xl font-bold text-slate-900">
            Everything a serious trader needs
          </h2>
          <p className="mt-4 text-slate-600">
            From first trade to monthly review — Nivesh Pustika keeps your data organised and actionable.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="group rounded-2xl border border-slate-100 bg-white p-6 lg:p-8 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-900/5 transition-all"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-heading text-xl font-semibold text-slate-900">{title}</h3>
              <p className="mt-3 text-slate-600 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
