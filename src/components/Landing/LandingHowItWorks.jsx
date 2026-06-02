import React from 'react';
import { UserPlus, PenLine, TrendingUp } from 'lucide-react';

const STEPS = [
  {
    step: '01',
    icon: UserPlus,
    title: 'Create your account',
    desc: 'Sign up in seconds with email. Start your 7-day free trial — no card needed.',
  },
  {
    step: '02',
    icon: PenLine,
    title: 'Log every trade',
    desc: 'Record entry, exit, segment & direction. P&L is calculated automatically in ₹.',
  },
  {
    step: '03',
    icon: TrendingUp,
    title: 'Review & improve',
    desc: 'Use dashboards, equity curves & segment stats to refine your edge over time.',
  },
];

export function LandingHowItWorks() {
  return (
    <section id="how-it-works" className="py-16 lg:py-24 bg-emerald-900 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-emerald-300 font-semibold text-sm uppercase tracking-wide mb-3">How it works</p>
          <h2 className="font-heading text-3xl lg:text-4xl font-bold">Three steps to a sharper edge</h2>
          <p className="mt-4 text-emerald-100/80">
            Simple workflow designed for busy traders — web or mobile PWA.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12 max-w-5xl mx-auto">
          {STEPS.map(({ step, icon: Icon, title, desc }) => (
            <div key={step} className="relative text-center md:text-left">
              <span className="text-5xl font-heading font-extrabold text-emerald-800/80">{step}</span>
              <div className="mt-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-700 text-white">
                <Icon className="h-7 w-7" />
              </div>
              <h3 className="mt-5 font-heading text-xl font-semibold">{title}</h3>
              <p className="mt-3 text-emerald-100/75 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
