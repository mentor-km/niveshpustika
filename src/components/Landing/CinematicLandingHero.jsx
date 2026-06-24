import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ArrowRight, TrendingUp, IndianRupee, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/Landing/Logo';
import { Button } from '@/components/ui/button';

const INJECTED_STYLES = `
  .landing-headline-word { visibility: hidden; }

  .landing-bg-grid {
    background-size: 48px 48px;
    background-image:
      linear-gradient(to right, rgba(45, 139, 139, 0.07) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(45, 139, 139, 0.07) 1px, transparent 1px);
    mask-image: radial-gradient(ellipse at 50% 40%, black 0%, transparent 75%);
    -webkit-mask-image: radial-gradient(ellipse at 50% 40%, black 0%, transparent 75%);
  }

  .landing-text-primary {
    color: #1e293b;
  }

  .landing-text-accent {
    background: linear-gradient(135deg, #2d8b8b 0%, #f0544f 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    transform: translateZ(0);
  }

  .landing-surface-card {
    background: linear-gradient(160deg, #ffffff 0%, #f0fdfa 100%);
    box-shadow:
      0 24px 60px -20px rgba(45, 139, 139, 0.22),
      0 8px 24px -8px rgba(15, 23, 42, 0.08),
      inset 0 1px 0 rgba(255, 255, 255, 0.9);
    border: 1px solid rgba(45, 139, 139, 0.12);
    position: relative;
  }

  .landing-card-sheen {
    position: absolute; inset: 0; border-radius: inherit; pointer-events: none; z-index: 50;
    background: radial-gradient(500px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(45, 139, 139, 0.06) 0%, transparent 45%);
  }

  .landing-iphone-bezel {
    background-color: #1e293b;
    box-shadow:
      inset 0 0 0 2px #64748b,
      inset 0 0 0 7px #0f172a,
      0 32px 64px -16px rgba(45, 139, 139, 0.35),
      0 12px 24px -8px rgba(15, 23, 42, 0.25);
    transform-style: preserve-3d;
  }

  .landing-hardware-btn {
    background: linear-gradient(90deg, #64748b 0%, #334155 100%);
    box-shadow: -2px 0 4px rgba(0, 0, 0, 0.25);
  }

  .landing-screen-glare {
    background: linear-gradient(110deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0) 45%);
  }

  .landing-widget-depth {
    background: rgba(255, 255, 255, 0.06);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.08);
  }

  .landing-floating-badge {
    background: rgba(255, 255, 255, 0.92);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    box-shadow: 0 8px 24px -8px rgba(45, 139, 139, 0.25), 0 0 0 1px rgba(45, 139, 139, 0.12);
    border: 1px solid rgba(45, 139, 139, 0.1);
  }

  .landing-cta-btn {
    background: linear-gradient(135deg, #2d8b8b 0%, #267a7a 100%);
    color: #fff;
    box-shadow: 0 4px 14px rgba(45, 139, 139, 0.4), 0 1px 2px rgba(0, 0, 0, 0.06);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  .landing-cta-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(45, 139, 139, 0.45), 0 2px 4px rgba(0, 0, 0, 0.08);
  }

  .landing-bar-teal { background: #2d8b8b; }
  .landing-bar-coral { background: #f0544f; }
`;

const CHART_BARS = [
  { h: 42, tone: 'coral' },
  { h: 58, tone: 'teal' },
  { h: 48, tone: 'teal' },
  { h: 72, tone: 'coral' },
  { h: 65, tone: 'teal' },
  { h: 88, tone: 'coral' },
  { h: 76, tone: 'teal' },
  { h: 94, tone: 'coral' },
];

const HEADLINE_WORDS = [
  { text: 'Track', accent: false },
  { text: 'what', accent: false },
  { text: 'you', accent: false },
  { text: 'Trade.', accent: true },
];

export function CinematicLandingHero() {
  const containerRef = useRef(null);
  const cardRef = useRef(null);
  const mockupRef = useRef(null);
  const requestRef = useRef(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set('.landing-headline-word', { autoAlpha: 0, y: 22, filter: 'blur(6px)' });
      gsap.to('.landing-headline-word', {
        duration: 0.55,
        autoAlpha: 1,
        y: 0,
        filter: 'blur(0px)',
        stagger: 0.28,
        ease: 'power3.out',
        delay: 0.35,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;

    const handleMouseMove = (e) => {
      if (isCoarsePointer) return;

      cancelAnimationFrame(requestRef.current);
      requestRef.current = requestAnimationFrame(() => {
        if (cardRef.current) {
          const rect = cardRef.current.getBoundingClientRect();
          cardRef.current.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
          cardRef.current.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
        }
        if (mockupRef.current) {
          const xVal = (e.clientX / window.innerWidth - 0.5) * 2;
          const yVal = (e.clientY / window.innerHeight - 0.5) * 2;
          gsap.to(mockupRef.current, {
            rotationY: xVal * 6,
            rotationX: -yVal * 6,
            ease: 'power3.out',
            duration: 1,
          });
        }
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative h-dvh max-h-dvh w-full overflow-hidden flex flex-col bg-gradient-to-br from-[#f8fffe] via-[#f0fdfa] to-[#ecfdf5] text-slate-800 font-sans antialiased"
      style={{ perspective: '1200px' }}
    >
      <style dangerouslySetInnerHTML={{ __html: INJECTED_STYLES }} />
      <div className="landing-bg-grid absolute inset-0 z-0 pointer-events-none" aria-hidden="true" />
      <div
        className="absolute top-0 right-0 w-80 h-80 bg-teal-200/30 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-0 w-96 h-96 bg-[#f0544f]/10 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <header className="relative z-30 shrink-0 px-4 sm:px-6 lg:px-10 py-4 sm:py-5">
        <Link to="/" className="inline-block">
          <Logo variant="light" />
        </Link>
      </header>

      <main className="relative z-20 flex-1 min-h-0 px-4 sm:px-6 lg:px-10 pb-2">
        <div
          ref={cardRef}
          className={cn(
            'landing-surface-card',
            'h-full max-h-full rounded-2xl sm:rounded-3xl overflow-hidden',
            'flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-8',
            'px-4 py-5 sm:px-8 sm:py-6 lg:px-12 lg:py-8'
          )}
        >
          <div className="landing-card-sheen" aria-hidden="true" />

          <div className="relative z-10 flex flex-col items-center lg:items-start text-center lg:text-left lg:flex-1 lg:max-w-md w-full">
            <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-4 sm:mb-5">
              <span className="rounded-full bg-teal-100 border border-teal-200 px-3 py-1 text-xs font-semibold text-teal-800">
                Free to use
              </span>
              <span className="rounded-full bg-white border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700">
                Made in India 🇮🇳
              </span>
            </div>

            <h1
              className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold tracking-tight leading-[1.15] flex flex-wrap justify-center lg:justify-start gap-x-3 gap-y-1"
              aria-label="Track what you Trade"
            >
              {HEADLINE_WORDS.map((word) => (
                <span
                  key={word.text}
                  className={cn(
                    'landing-headline-word inline-block',
                    word.accent ? 'landing-text-accent' : 'landing-text-primary'
                  )}
                >
                  {word.text}
                </span>
              ))}
            </h1>

            <p className="mt-4 sm:mt-5 text-sm sm:text-base text-slate-600 leading-relaxed max-w-sm">
              Built by a trader, for Indian traders. Log Equity, Futures, Options, Currency &amp; MCX —
              track P&amp;L in ₹ on web or mobile web app.
            </p>

            <p className="mt-3 text-xs sm:text-sm font-medium text-teal-700">
              Standard plan · Full access · No payment required
            </p>

            <Button
              asChild
              size="lg"
              className="landing-cta-btn mt-6 sm:mt-8 h-12 sm:h-14 px-8 sm:px-10 text-base sm:text-lg font-bold rounded-2xl border-0"
            >
              <Link to="/app">
                Start here
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>

          <div
            className="relative z-10 flex items-center justify-center w-full lg:flex-1 min-h-0"
            style={{ perspective: '1000px' }}
          >
            <div className="relative flex items-center justify-center scale-[0.72] sm:scale-[0.82] md:scale-90 lg:scale-100">
              <div
                ref={mockupRef}
                className="landing-iphone-bezel relative w-[240px] h-[500px] sm:w-[260px] sm:h-[540px] rounded-[2.75rem] flex flex-col will-change-transform"
              >
                <div className="absolute top-[110px] -left-[3px] w-[3px] h-[22px] landing-hardware-btn rounded-l-md z-0" aria-hidden="true" />
                <div className="absolute top-[148px] -left-[3px] w-[3px] h-[40px] landing-hardware-btn rounded-l-md z-0" aria-hidden="true" />
                <div className="absolute top-[200px] -left-[3px] w-[3px] h-[40px] landing-hardware-btn rounded-l-md z-0" aria-hidden="true" />
                <div className="absolute top-[155px] -right-[3px] w-[3px] h-[64px] landing-hardware-btn rounded-r-md z-0 scale-x-[-1]" aria-hidden="true" />

                <div className="absolute inset-[7px] bg-slate-900 rounded-[2.35rem] overflow-hidden z-10">
                  <div className="absolute inset-0 landing-screen-glare z-40 pointer-events-none" aria-hidden="true" />
                  <div className="absolute top-[5px] left-1/2 -translate-x-1/2 w-[90px] h-[26px] bg-black rounded-full z-50 flex items-center justify-end px-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.8)]" />
                  </div>

                  <div className="relative w-full h-full pt-11 px-4 pb-6 flex flex-col text-white">
                    <div className="flex justify-between items-center mb-5">
                      <div>
                        <p className="text-[9px] text-neutral-400 uppercase tracking-widest font-bold">Dashboard</p>
                        <p className="text-lg font-bold tracking-tight">Nivesh Pustika</p>
                      </div>
                      <img
                        src="/logo.png"
                        alt=""
                        className="h-8 w-8 rounded-lg object-cover shadow-sm"
                        aria-hidden="true"
                      />
                    </div>

                    <div className="landing-widget-depth rounded-2xl p-3 mb-4">
                      <p className="text-[10px] text-neutral-400 mb-0.5">Net P&amp;L</p>
                      <p className="text-2xl font-bold text-teal-300 flex items-center gap-1">
                        <IndianRupee className="w-5 h-5" aria-hidden="true" />
                        42,850
                      </p>
                      <p className="text-[10px] text-teal-200/70 mt-1">Win rate 68%</p>
                    </div>

                    <div className="h-20 rounded-xl bg-black/30 border border-white/5 flex items-end px-2 pb-2 gap-1 mb-4">
                      {CHART_BARS.map((bar, i) => (
                        <div
                          key={i}
                          className={cn('flex-1 rounded-t', bar.tone === 'teal' ? 'landing-bar-teal' : 'landing-bar-coral')}
                          style={{ height: `${bar.h}%` }}
                        />
                      ))}
                    </div>

                    <div className="space-y-2">
                      <div className="landing-widget-depth rounded-xl p-2.5 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-teal-500/20 flex items-center justify-center border border-teal-400/20">
                          <TrendingUp className="w-3.5 h-3.5 text-teal-300" />
                        </div>
                        <div>
                          <p className="text-[11px] font-semibold">Equity · F&amp;O</p>
                          <p className="text-[9px] text-neutral-400">124 trades logged</p>
                        </div>
                      </div>
                      <div className="landing-widget-depth rounded-xl p-2.5 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-[#f0544f]/20 flex items-center justify-center border border-[#f0544f]/30">
                          <BarChart3 className="w-3.5 h-3.5 text-[#f0544f]" />
                        </div>
                        <div>
                          <p className="text-[11px] font-semibold">Segment P&amp;L</p>
                          <p className="text-[9px] text-neutral-400">MCX · Currency</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="landing-floating-badge absolute -left-2 sm:-left-8 top-8 sm:top-12 rounded-xl p-2.5 sm:p-3 flex items-center gap-2 z-30">
                <span className="text-lg" aria-hidden="true">🇮🇳</span>
                <div>
                  <p className="text-slate-800 text-[11px] sm:text-xs font-bold">Made in India</p>
                  <p className="text-teal-600 text-[9px] sm:text-[10px]">For Indian markets</p>
                </div>
              </div>

              <div className="landing-floating-badge absolute -right-2 sm:-right-8 bottom-16 sm:bottom-20 rounded-xl p-2.5 sm:p-3 flex items-center gap-2 z-30">
                <span className="text-lg" aria-hidden="true">✓</span>
                <div>
                  <p className="text-slate-800 text-[11px] sm:text-xs font-bold">100% Free</p>
                  <p className="text-teal-600 text-[9px] sm:text-[10px]">No payment needed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="relative z-30 shrink-0 px-4 sm:px-6 lg:px-10 py-3 sm:py-4 border-t border-teal-200/60 bg-white/40 backdrop-blur-sm">
        <div className="flex flex-wrap items-center justify-center sm:justify-between gap-x-5 gap-y-2 text-xs sm:text-sm text-slate-500">
          <p className="order-2 sm:order-1 w-full sm:w-auto text-center sm:text-left">
            © {new Date().getFullYear()} Nivesh Pustika
          </p>
          <nav className="order-1 sm:order-2 flex flex-wrap items-center justify-center gap-x-5 gap-y-1" aria-label="Footer">
            <Link to="/privacy" className="hover:text-teal-700 transition-colors">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-teal-700 transition-colors">
              Terms
            </Link>
            <Link to="/app" className="hover:text-teal-700 transition-colors font-medium text-teal-700">
              Login
            </Link>
            <span className="text-slate-600">Made in India 🇮🇳</span>
          </nav>
        </div>
      </footer>
    </div>
  );
}
