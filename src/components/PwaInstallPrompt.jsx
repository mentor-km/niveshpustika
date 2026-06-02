import React, { useEffect, useState } from 'react';
import { Download, Share, X, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';

function isStandalone() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
  );
}

function isMobileDevice() {
  return /Android|iPhone|iPad|iPod|Mobile/i.test(window.navigator.userAgent);
}

function isIOS() {
  return /iPad|iPhone|iPod/.test(window.navigator.userAgent) && !window.MSStream;
}

export function PwaInstallPrompt() {
  const [visible, setVisible] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [ios, setIos] = useState(false);

  useEffect(() => {
    if (isStandalone()) return;
    if (localStorage.getItem('pwa-install-dismissed') === 'true') return;
    if (!isMobileDevice()) return;

    const onIOS = isIOS();
    setIos(onIOS);

    const showPrompt = () => setVisible(true);

    const onBeforeInstall = (event) => {
      event.preventDefault();
      setDeferredPrompt(event);
      showPrompt();
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstall);

    // Show prompt shortly after open on all mobile devices
    const timer = setTimeout(showPrompt, onIOS ? 800 : 1200);

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
      clearTimeout(timer);
    };
  }, []);

  const dismiss = () => {
    localStorage.setItem('pwa-install-dismissed', 'true');
    setVisible(false);
  };

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    dismiss();
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-[100] p-4 pb-safe animate-in slide-in-from-bottom duration-300">
      <div className="mx-auto max-w-md rounded-2xl border border-emerald-500/30 bg-gray-900 shadow-2xl shadow-black/40 p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600">
            <Smartphone className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <p className="font-semibold text-white text-sm">Install Nivesh Pustika</p>
              <button
                type="button"
                onClick={dismiss}
                className="text-gray-500 hover:text-gray-300 shrink-0"
                aria-label="Dismiss"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {ios ? (
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                Tap <Share className="inline h-3.5 w-3.5 mx-0.5 -mt-0.5" /> Share, then choose{' '}
                <strong className="text-emerald-400">Add to Home Screen</strong> to use it like an app.
              </p>
            ) : deferredPrompt ? (
              <p className="text-xs text-gray-400 mt-1">
                Add to your home screen for quick access — just like a mobile app.
              </p>
            ) : (
              <p className="text-xs text-gray-400 mt-1">
                Open browser menu (⋮) and tap <strong className="text-emerald-400">Install app</strong> or{' '}
                <strong className="text-emerald-400">Add to Home screen</strong>.
              </p>
            )}
            <div className="flex gap-2 mt-3">
              {deferredPrompt && !ios && (
                <Button
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white h-8 text-xs"
                  onClick={handleInstall}
                >
                  <Download className="h-3.5 w-3.5 mr-1.5" />
                  Install App
                </Button>
              )}
              <Button
                size="sm"
                variant="ghost"
                className="text-gray-400 h-8 text-xs"
                onClick={dismiss}
              >
                Not now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
