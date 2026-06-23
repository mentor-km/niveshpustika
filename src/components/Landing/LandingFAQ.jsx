import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const FAQS = [
  {
    q: 'What is Nivesh Pustika?',
    a: 'Nivesh Pustika is a trading tracker for Indian markets. Log trades across Equity, Futures, Options, Currency and MCX Commodities, then review performance on your dashboard.',
  },
  {
    q: 'How do I sign up?',
    a: 'Use your mobile number — we send an OTP to verify. You can also continue with Google. On mobile, install the PWA from the sign-in page for an app-like experience.',
  },
  {
    q: 'Which segments are supported?',
    a: 'Equity, Futures, Options, Currency, and MCX Commodities. Each trade is tagged by segment so you can filter and analyse performance separately.',
  },
  {
    q: 'Can I use it on my phone?',
    a: 'Yes. After signing in on mobile, install Nivesh Pustika to your home screen (PWA). It works like a native app — no Play Store needed.',
  },
  {
    q: 'Is there a cost?',
    a: 'No. Every user is on the Standard plan with full access — log trades, dashboard, analytics, and profile. No payments or subscriptions.',
  },
  {
    q: 'Is my data secure?',
    a: 'Your data is stored securely in the cloud with encrypted authentication. Only you can access your trades.',
  },
];

export function LandingFAQ() {
  return (
    <section id="faq" className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-12">
          <p className="text-emerald-600 font-semibold text-sm uppercase tracking-wide mb-3">FAQ</p>
          <h2 className="font-heading text-3xl lg:text-4xl font-bold text-slate-900">
            Common questions
          </h2>
        </div>
        <Accordion type="single" collapsible className="space-y-3">
          {FAQS.map((faq, i) => (
            <AccordionItem
              key={faq.q}
              value={`item-${i}`}
              className="rounded-xl border border-slate-200 bg-white px-4 data-[state=open]:border-emerald-200 data-[state=open]:shadow-sm"
            >
              <AccordionTrigger className="text-left font-semibold text-slate-900 hover:text-emerald-700 hover:no-underline py-4">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 leading-relaxed pb-4">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
