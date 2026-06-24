import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Spinner } from '@/components/ui/spinner';

export default function AdminRoute({ children }) {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8fffe] via-[#f0fdfa] to-[#ecfdf5] flex items-center justify-center">
        <Spinner className="w-8 h-8 text-[#2d8b8b]" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/app" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
