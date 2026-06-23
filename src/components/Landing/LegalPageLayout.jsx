import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { ArrowLeft } from 'lucide-react';
import { Logo } from '@/components/Landing/Logo';
import { LandingFooter } from '@/components/Landing/LandingFooter';

export function LegalPageLayout({ title, description, children }) {
  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col">
      <Helmet>
        <title>{title} — Nivesh Pustika</title>
        {description && <meta name="description" content={description} />}
      </Helmet>

      <header className="border-b border-emerald-100 bg-white/90 backdrop-blur-md sticky top-0 z-40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/">
            <Logo />
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700 hover:text-emerald-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <article className="container mx-auto px-4 py-12 md:py-16 max-w-3xl">
          {children}
        </article>
      </main>

      <LandingFooter />
    </div>
  );
}

export function LegalSection({ title, children }) {
  return (
    <section className="mb-10">
      <h2 className="text-xl font-semibold text-slate-900 mb-3">{title}</h2>
      <div className="space-y-3 text-slate-600 leading-relaxed text-[15px]">{children}</div>
    </section>
  );
}
