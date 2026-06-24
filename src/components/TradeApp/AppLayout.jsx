import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, List, LogOut, Plus, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { Logo } from '@/components/Landing/Logo';
import { signOut } from '@/lib/supabase';
import TradeForm from '@/components/TradeApp/TradeForm';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/trades', label: 'Trades', icon: List },
  { to: '/profile', label: 'Profile', icon: User },
];

export default function AppLayout({ children, showFab = true }) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showTradeForm, setShowTradeForm] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: 'Logged Out',
        description: 'You have been successfully logged out.',
      });
      navigate('/app');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Logout Failed',
        description: error.message,
      });
    }
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
      isActive
        ? 'bg-teal-100 text-teal-800 font-medium'
        : 'text-slate-600 hover:bg-teal-50 hover:text-teal-900'
    }`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fffe] via-[#f0fdfa] to-[#ecfdf5] flex">
      <aside className="hidden md:flex flex-col w-64 bg-white/80 backdrop-blur-md border-r border-teal-200/60 p-4 fixed inset-y-0 left-0 z-40 shadow-sm">
        <div className="flex items-center gap-3 mb-8 px-2">
          <Logo className="h-10 w-10" showText={false} variant="light" />
          <span className="text-lg font-bold font-heading text-slate-800 leading-tight">Nivesh Pustika</span>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={navLinkClass}>
              <Icon className="w-5 h-5" />
              {label}
            </NavLink>
          ))}
        </nav>

        <Button
          onClick={handleLogout}
          variant="ghost"
          className="text-slate-600 hover:bg-teal-50 hover:text-teal-900 justify-start gap-3"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </Button>
      </aside>

      <div className="flex-1 md:ml-64 pb-20 md:pb-8">
        <main className="container mx-auto p-4 md:p-8">{children}</main>
      </div>

      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white/90 backdrop-blur-md border-t border-teal-200/60 z-40 shadow-[0_-4px_20px_rgba(45,139,139,0.08)]">
        <div className="flex items-center justify-around py-2">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-3 py-2 text-xs ${
                  isActive ? 'text-teal-700 font-medium' : 'text-slate-500'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              {label}
            </NavLink>
          ))}
        </div>
      </nav>

      {showFab && (
        <Button
          onClick={() => setShowTradeForm(true)}
          className="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-50 w-14 h-14 rounded-full bg-[#2d8b8b] hover:bg-[#267a7a] shadow-lg shadow-teal-900/25"
          size="icon"
        >
          <Plus className="w-6 h-6" />
        </Button>
      )}

      <Dialog open={showTradeForm} onOpenChange={setShowTradeForm}>
        <DialogContent className="bg-white border-teal-200/60 text-slate-800 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-slate-800">Log New Trade</DialogTitle>
          </DialogHeader>
          <TradeForm onSuccess={() => setShowTradeForm(false)} onCancel={() => setShowTradeForm(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
