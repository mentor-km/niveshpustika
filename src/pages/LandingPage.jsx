import React from 'react';
import { Helmet } from 'react-helmet';
import { CinematicLandingHero } from '@/components/Landing/CinematicLandingHero';

export default function LandingPage() {
  return (
    <>
      <Helmet>
        <title>Nivesh Pustika — Track what you Trade</title>
        <meta
          name="description"
          content="Free trading journal for Indian markets. Built by a trader, for Indian traders. Log trades, track P&L in ₹ on web or mobile web app."
        />
      </Helmet>
      <CinematicLandingHero />
    </>
  );
}
