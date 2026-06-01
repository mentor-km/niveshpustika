import React from 'react';
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { HowItWorksSection } from '@/components/HowItWorksSection';
import { DashboardPreviewSection } from '@/components/DashboardPreviewSection';
import { DownloadAppSection } from '@/components/DownloadAppSection';
import { FAQSection } from '@/components/FAQSection';
import { Footer } from '@/components/Footer';
import { Helmet } from 'react-helmet';

export default function LandingPage() {
  return (
    <>
      <Helmet>
        <title>Nivesh Pustika — Trading Journal & Trade Tracker (Web + Android)</title>
        <meta name="description" content="Log trades, track performance, and see smart analytics. 7-day free trial — mobile & web." />
      </Helmet>
      <Header />
      <main>
        <HeroSection />
        <HowItWorksSection />
        <DashboardPreviewSection />
        <DownloadAppSection />
        <FAQSection />
      </main>
      <Footer />
    </>
  );
}