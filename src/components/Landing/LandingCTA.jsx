import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function LandingCTA() {
  return (
    <section className="py-16 lg:py-20 bg-emerald-600">
      <div className="container mx-auto px-4 text-center">
        <h2 className="font-heading text-3xl lg:text-4xl font-bold text-white">
          Ready to journal like a pro?
        </h2>
        <p className="mt-4 text-emerald-100 max-w-xl mx-auto text-lg">
          Join Nivesh Pustika today. Your first 7 days are on us — full dashboard, all segments, zero risk.
        </p>
        <Button
          asChild
          size="lg"
          className="mt-8 bg-white text-emerald-700 hover:bg-emerald-50 font-semibold h-12 px-8"
        >
          <Link to="/app">
            Get Started Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
