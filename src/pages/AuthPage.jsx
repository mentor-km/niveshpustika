import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Smartphone, Share, Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Logo } from '@/components/Landing/Logo';
import {
  sendPhoneOtp,
  verifyPhoneOtp,
  signInWithGoogle,
  formatPhone,
} from '@/lib/supabase';

const GoogleIcon = (props) => (
  <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

function isMobileDevice() {
  return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
}

function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

function isStandalone() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
  );
}

function AuthPwaBanner() {
  const [visible, setVisible] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [ios, setIos] = useState(false);

  useEffect(() => {
    if (!isMobileDevice() || isStandalone()) return;
    if (localStorage.getItem('pwa-auth-dismissed') === 'true') return;

    setIos(isIOS());

    const onBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setVisible(true);
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    const timer = setTimeout(() => setVisible(true), 600);

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
      clearTimeout(timer);
    };
  }, []);

  const dismiss = () => {
    localStorage.setItem('pwa-auth-dismissed', 'true');
    setVisible(false);
  };

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    dismiss();
  };

  if (!visible) return null;

  return (
    <div className="mt-6 rounded-xl border border-emerald-500/30 bg-emerald-950/50 p-4">
      <div className="flex items-start gap-3">
        <Smartphone className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-white">Install for the best mobile experience</p>
          {ios ? (
            <p className="text-xs text-gray-400 mt-1">
              Tap <Share className="inline h-3 w-3" /> Share → <strong className="text-emerald-400">Add to Home Screen</strong>
            </p>
          ) : deferredPrompt ? (
            <Button
              size="sm"
              className="mt-2 bg-emerald-600 hover:bg-emerald-700 text-white h-8"
              onClick={handleInstall}
            >
              <Download className="h-3.5 w-3.5 mr-1.5" />
              Install App
            </Button>
          ) : (
            <p className="text-xs text-gray-400 mt-1">
              Use browser menu → <strong className="text-emerald-400">Install app</strong>
            </p>
          )}
        </div>
        <button type="button" onClick={dismiss} className="text-gray-500 hover:text-gray-300">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default function AuthPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const [step, setStep] = useState('phone'); // phone | otp
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formattedPhone, setFormattedPhone] = useState('');

  useEffect(() => {
    if (!authLoading && user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, authLoading, navigate]);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    const digits = phone.replace(/\D/g, '');
    if (digits.length !== 10) {
      toast({
        variant: 'destructive',
        title: 'Invalid number',
        description: 'Enter a valid 10-digit Indian mobile number.',
      });
      return;
    }
    setSubmitting(true);
    try {
      const { phone: formatted } = await sendPhoneOtp(phone);
      setFormattedPhone(formatted);
      setStep('otp');
      toast({
        title: 'OTP Sent',
        description: `Check SMS on ${formatPhone(phone).replace('+91', '+91 ')}`,
        className: 'bg-emerald-500 text-white',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Could not send OTP',
        description: error.message || 'Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast({
        variant: 'destructive',
        title: 'Invalid OTP',
        description: 'Enter the 6-digit code from SMS.',
      });
      return;
    }
    setSubmitting(true);
    try {
      await verifyPhoneOtp(formattedPhone || phone, otp);
      toast({
        title: 'Welcome!',
        description: 'You are signed in.',
        className: 'bg-emerald-500 text-white',
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Verification failed',
        description: error.message || 'Check the code and try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    setSubmitting(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Google sign-in failed',
        description: error.message,
      });
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <Spinner className="w-8 h-8 text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <Logo className="h-14 mx-auto" textClassName="!text-white" />
          <p className="text-gray-400 mt-3 text-sm">Your trading journal — web &amp; mobile</p>
        </div>

        <Card className="bg-gray-900 border-gray-700">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl text-white">
              {step === 'phone' ? 'Sign in' : 'Enter OTP'}
            </CardTitle>
            <CardDescription className="text-gray-400">
              {step === 'phone'
                ? 'Use your mobile number or Google account'
                : `Code sent to ${formattedPhone.replace('+91', '+91 ')}`}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {step === 'phone' ? (
              <>
                <Button
                  variant="outline"
                  className="w-full border-gray-600 text-gray-200 hover:bg-gray-800"
                  onClick={handleGoogle}
                  disabled={submitting}
                >
                  <GoogleIcon className="mr-2 h-4 w-4" />
                  Continue with Google
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-700" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-gray-900 px-2 text-gray-500">Or with mobile</span>
                  </div>
                </div>

                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label htmlFor="phone" className="text-sm text-gray-300 block mb-2">
                      Mobile number
                    </label>
                    <div className="flex gap-2">
                      <span className="flex items-center px-3 rounded-md bg-gray-800 border border-gray-600 text-gray-400 text-sm">
                        +91
                      </span>
                      <Input
                        id="phone"
                        type="tel"
                        inputMode="numeric"
                        placeholder="98765 43210"
                        maxLength={10}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        className="bg-gray-800 border-gray-600 text-white flex-1"
                        required
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    disabled={submitting || phone.length !== 10}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                  >
                    {submitting ? <Spinner className="mr-2" /> : null}
                    Send OTP
                  </Button>
                </form>
              </>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div className="flex justify-center">
                  <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                    <InputOTPGroup>
                      {[0, 1, 2, 3, 4, 5].map((i) => (
                        <InputOTPSlot
                          key={i}
                          index={i}
                          className="bg-gray-800 border-gray-600 text-white w-10 h-11"
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                <Button
                  type="submit"
                  disabled={submitting || otp.length !== 6}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                >
                  {submitting ? <Spinner className="mr-2" /> : null}
                  Verify &amp; Continue
                </Button>
                <button
                  type="button"
                  className="w-full text-sm text-gray-400 hover:text-emerald-400"
                  onClick={() => {
                    setStep('phone');
                    setOtp('');
                  }}
                >
                  Change number
                </button>
              </form>
            )}

            <AuthPwaBanner />

            <p className="text-center text-xs text-gray-500 pt-2">
              Standard plan — full access for every user. No payment required.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
