import React from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { PwaInstallPrompt } from '@/components/PwaInstallPrompt';

function App() {
  return (
    <div className="min-h-screen font-sans">
      <Outlet />
      <Toaster />
      <PwaInstallPrompt />
    </div>
  );
}

export default App;