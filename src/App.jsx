import React from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-300 font-sans">
      <Outlet />
      <Toaster />
    </div>
  );
}

export default App;