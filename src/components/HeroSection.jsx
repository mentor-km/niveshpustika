import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  return (
    <section className="pt-32 pb-12 lg:pt-40 lg:pb-20 bg-gray-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-gray-700/[0.2]"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-transparent to-gray-900"></div>
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h1 className="text-4xl lg:text-6xl font-extrabold font-heading leading-tight text-white">
            Track your trades. <span className="gradient-text">Grow your returns.</span>
          </h1>
          <p className="text-lg lg:text-xl text-gray-400 leading-relaxed mt-6">
            Start a 7-day free trial — log trades on web or Android and get instant dashboards, P&L charts and CSV exports.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg py-7 px-8">
              <Link to="/app">Get Started — 7-day Free Trial</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white text-lg py-7 px-8">
              <a href="#download">Download Android App</a>
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-4">No credit card required</p>
        </motion.div>
      </div>
    </section>
  );
}