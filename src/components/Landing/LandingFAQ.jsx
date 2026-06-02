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
    a: 'Nivesh Pustika is a trading journal built for Indian markets. Log trades across Equity, Futures, Options, Currency and MCX Commodities, then review performance on a detailed dashboard.',
  },
  {
    q: 'Which segments are supported?',
    a: 'Equity, Futures, Options, Currency, and MCX Commodities. Each trade is tagged by segment so you can filter and analyse performance separately.',
  },
  {
    q: 'Can I use it on my phone?',
    a: 'Yes. Nivesh Pustika is a Progressive Web App (PWA). Open it in your mobile browser and use "Add to Home Screen" to install it like an app.',
  },
  {
    q: 'Is there a free trial?',
    a: 'Yes — every new account gets a 7-day free trial with full access to all dashboard features. No credit card is required to sign up.',
  },
  {
    q: 'What happens after the trial?',
    a: 'You can continue logging trades and viewing a basic dashboard for free. The full detailed analytics dashboard will require a subscription (coming soon).',
  },
  {
    q: 'Is my data secure?',
    a: 'Your data is stored securely in the cloud with encrypted authentication. Only you can access your trades unless you use the admin panel (owner only).',
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
