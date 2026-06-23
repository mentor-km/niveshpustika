import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Smartphone, TrendingUp, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

const highlights = [
  { icon: TrendingUp, text: 'Equity curve & segment analytics' },
  { icon: Smartphone, text: 'Web + installable PWA on mobile' },
  { icon: ShieldCheck, text: 'Sign in with mobile OTP or Google' },
];

export function LandingHero() {
  return (
    <section className="relative pt-28 pb-16 lg:pt-36 lg:pb-24 overflow-hidden bg-white">
      <div className="absolute inset-0 landing-hero-pattern opacity-40" />
      <div className="absolute top-20 right-0 w-72 h-72 bg-emerald-100 rounded-full blur-3xl opacity-60" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-50 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center rounded-full bg-emerald-50 border border-emerald-200 px-4 py-1.5 text-sm font-medium text-emerald-800 mb-6">
              India&apos;s smart trading journal
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight">
              Log every trade.
              <span className="block text-emerald-600">Grow with clarity.</span>
            </h1>
            <p className="mt-6 text-lg text-slate-600 leading-relaxed max-w-xl">
              Nivesh Pustika helps Indian traders record Equity, Futures, Options, Currency &amp; MCX
              trades — then turns them into dashboards and P&amp;L insights you can trust.
            </p>

            <ul className="mt-8 space-y-3">
              {highlights.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3 text-slate-700">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                    <Icon className="h-4 w-4" />
                  </span>
                  {text}
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                size="lg"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-base h-12 px-8 shadow-lg shadow-emerald-600/25"
              >
                <Link to="/app">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-emerald-300 text-emerald-800 hover:bg-emerald-50 h-12 px-8"
              >
                <a href="#how-it-works">See how it works</a>
              </Button>
            </div>
            <p className="mt-4 text-sm text-slate-500">Standard plan · Full access · No payment required</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative"
          >
            <div className="rounded-2xl border border-emerald-100 bg-white shadow-2xl shadow-emerald-900/10 p-6 lg:p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm text-slate-500">Net P&amp;L</p>
                  <p className="text-3xl font-bold text-emerald-600">+₹42,850</p>
                </div>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                  Win rate 68%
                </span>
              </div>
              <div className="h-36 rounded-xl bg-gradient-to-t from-emerald-50 to-white border border-emerald-100 flex items-end px-2 pb-2 gap-1">
                {[40, 55, 45, 70, 62, 85, 78, 92].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t bg-emerald-500/80"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
              <div className="grid grid-cols-3 gap-3 mt-6">
                {[
                  { label: 'Trades', value: '124' },
                  { label: 'Avg Win', value: '₹2.4k' },
                  { label: 'R:R', value: '1.8' },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-xl bg-emerald-50/80 p-3 text-center">
                    <p className="text-xs text-slate-500">{stat.label}</p>
                    <p className="font-bold text-slate-800">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>
            <img
              src="/logo.png"
              alt=""
              aria-hidden
              className="absolute -bottom-6 -right-4 w-28 h-28 opacity-90 drop-shadow-lg hidden sm:block"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
