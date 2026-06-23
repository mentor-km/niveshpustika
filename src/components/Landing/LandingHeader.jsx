import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Landing/Logo';

const NAV = [
  { label: 'Features', href: '#features' },
  { label: 'Segments', href: '#segments' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'FAQ', href: '#faq' },
];

export function LandingHeader() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 bg-white/90 backdrop-blur-md border-b border-emerald-100">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/">
            <Logo />
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-slate-600 hover:text-emerald-700 transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Button asChild variant="ghost" className="text-emerald-800 hover:text-emerald-900 hover:bg-emerald-50">
              <Link to="/app">Log in</Link>
            </Button>
            <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-md shadow-emerald-600/20">
              <Link to="/app">Get Started</Link>
            </Button>
          </div>

          <button
            type="button"
            className="md:hidden p-2 text-emerald-800"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-white p-6 md:hidden"
          >
            <div className="flex items-center justify-between mb-10">
              <Logo />
              <button type="button" onClick={() => setOpen(false)} aria-label="Close menu">
                <X className="w-6 h-6 text-slate-600" />
              </button>
            </div>
            <nav className="flex flex-col gap-6">
              {NAV.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-xl font-semibold text-slate-800"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </a>
              ))}
            </nav>
            <div className="mt-10 flex flex-col gap-3">
              <Button asChild variant="outline" className="border-emerald-600 text-emerald-700">
                <Link to="/app" onClick={() => setOpen(false)}>Log in</Link>
              </Button>
              <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white">
                <Link to="/app" onClick={() => setOpen(false)}>Get Started</Link>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
