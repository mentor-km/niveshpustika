import React from 'react';
import { Helmet } from 'react-helmet';
import { LandingHeader } from '@/components/Landing/LandingHeader';
import { LandingHero } from '@/components/Landing/LandingHero';
import { LandingSegments } from '@/components/Landing/LandingSegments';
import { LandingFeatures } from '@/components/Landing/LandingFeatures';
import { LandingHowItWorks } from '@/components/Landing/LandingHowItWorks';
import { LandingDashboardPreview } from '@/components/Landing/LandingDashboardPreview';
import { LandingFAQ } from '@/components/Landing/LandingFAQ';
import { LandingCTA } from '@/components/Landing/LandingCTA';
import { LandingFooter } from '@/components/Landing/LandingFooter';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-800">
      <Helmet>
        <title>Nivesh Pustika — Trading Journal for Indian Markets</title>
        <meta
          name="description"
          content="Log Equity, Futures, Options, Currency & MCX trades. Track P&L in ₹ on web or mobile PWA. Free Standard plan for all users."
        />
      </Helmet>
      <LandingHeader />
      <main>
        <LandingHero />
        <LandingSegments />
        <LandingFeatures />
        <LandingHowItWorks />
        <LandingDashboardPreview />
        <LandingFAQ />
        <LandingCTA />
      </main>
      <LandingFooter />
    </div>
  );
}
