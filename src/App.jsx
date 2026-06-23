import React from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <div className="min-h-screen font-sans">
      <Outlet />
      <Toaster />
    </div>
  );
}

export default App;