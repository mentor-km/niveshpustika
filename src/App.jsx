import React from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import PwaUpdatePrompt from '@/components/PwaUpdatePrompt';

function App() {
  return (
    <div className="min-h-screen font-sans">
      <Outlet />
      <Toaster />
      <PwaUpdatePrompt />
    </div>
  );
}

export default App;
