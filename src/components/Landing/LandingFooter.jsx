import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '@/components/Landing/Logo';

export function LandingFooter() {
  return (
    <footer className="bg-emerald-950 text-emerald-100/80">
      <div className="container mx-auto px-4 py-14">
        <div className="grid md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <Logo textClassName="!text-white" />
            <p className="mt-4 text-sm leading-relaxed max-w-sm text-emerald-200/70">
              The trading journal for Indian markets. Log trades, track P&amp;L in ₹, and grow with
              data-driven insights.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#segments" className="hover:text-white transition-colors">Segments</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Account</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/app" className="hover:text-white transition-colors">Sign up</Link></li>
              <li><Link to="/app" className="hover:text-white transition-colors">Log in</Link></li>
              <li><Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-emerald-900 flex flex-col sm:flex-row justify-between gap-4 text-sm text-emerald-300/60">
          <p>© {new Date().getFullYear()} Nivesh Pustika. All rights reserved.</p>
          <p>Made for traders in India 🇮🇳</p>
        </div>
      </div>
    </footer>
  );
}
