import React from 'react';

const SEGMENTS = [
  { name: 'Equity', desc: 'Cash market delivery & intraday' },
  { name: 'Futures', desc: 'Index & stock F&O contracts' },
  { name: 'Options', desc: 'Calls, puts & multi-leg setups' },
  { name: 'Currency', desc: 'USDINR & major pairs' },
  { name: 'MCX Commodities', desc: 'Gold, silver, crude & more' },
];

export function LandingSegments() {
  return (
    <section id="segments" className="py-16 lg:py-20 bg-emerald-50/60 border-y border-emerald-100">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="font-heading text-3xl lg:text-4xl font-bold text-slate-900">
            Built for every segment you trade
          </h2>
          <p className="mt-4 text-slate-600">
            One journal for your entire book — tag each trade correctly and analyse performance by market.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {SEGMENTS.map((seg) => (
            <div
              key={seg.name}
              className="rounded-2xl bg-white border border-emerald-100 p-5 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all"
            >
              <div className="h-2 w-10 rounded-full bg-emerald-500 mb-4" />
              <h3 className="font-heading font-semibold text-slate-900">{seg.name}</h3>
              <p className="mt-2 text-sm text-slate-500 leading-relaxed">{seg.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
