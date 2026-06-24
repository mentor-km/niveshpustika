import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { CinematicLandingHero } from '@/components/Landing/CinematicLandingHero';
import { useAuth } from '@/hooks/useAuth';
import { isStandalone } from '@/lib/pwa';
import { Spinner } from '@/components/ui/spinner';

export default function LandingPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const standalone = isStandalone();
  const [redirecting, setRedirecting] = useState(standalone);

  useEffect(() => {
    if (!standalone || loading) return;
    setRedirecting(true);
    navigate(user ? '/dashboard' : '/app', { replace: true });
  }, [user, loading, navigate, standalone]);

  if (standalone && (loading || redirecting)) {
    return (
      <div className="min-h-[100dvh] bg-gradient-to-br from-[#f8fffe] via-[#f0fdfa] to-[#ecfdf5] flex items-center justify-center safe-top safe-bottom">
        <Spinner className="w-8 h-8 text-[#2d8b8b]" />
      </div>
    );
  }

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
