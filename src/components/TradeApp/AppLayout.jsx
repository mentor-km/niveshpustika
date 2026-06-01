import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { BarChart3, LayoutDashboard, List, LogOut, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { signOut } from '@/lib/supabase';
import TradeForm from '@/components/TradeApp/TradeForm';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/trades', label: 'Trades', icon: List },
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
        ? 'bg-emerald-500/10 text-emerald-400'
        : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
    }`;

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-gray-900 border-r border-gray-800 p-4 fixed inset-y-0 left-0 z-40">
        <div className="flex items-center space-x-3 mb-8 px-2">
          <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold font-heading text-white">Nivesh पुस्तिका</span>
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
          className="text-gray-400 hover:bg-gray-800 hover:text-white justify-start gap-3"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </Button>
      </aside>

      {/* Main content */}
      <div className="flex-1 md:ml-64 pb-20 md:pb-8">
        <main className="container mx-auto p-4 md:p-8">{children}</main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-gray-900 border-t border-gray-800 z-40">
        <div className="flex items-center justify-around py-2">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-4 py-2 text-xs ${
                  isActive ? 'text-emerald-400' : 'text-gray-500'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              {label}
            </NavLink>
          ))}
          <button
            onClick={handleLogout}
            className="flex flex-col items-center gap-1 px-4 py-2 text-xs text-gray-500"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </nav>

      {/* FAB */}
      {showFab && (
        <Button
          onClick={() => setShowTradeForm(true)}
          className="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-50 w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/30"
          size="icon"
        >
          <Plus className="w-6 h-6" />
        </Button>
      )}

      <Dialog open={showTradeForm} onOpenChange={setShowTradeForm}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Log New Trade</DialogTitle>
          </DialogHeader>
          <TradeForm onSuccess={() => setShowTradeForm(false)} onCancel={() => setShowTradeForm(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
