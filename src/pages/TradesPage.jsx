import React from 'react';
import { motion } from 'framer-motion';
import { List } from 'lucide-react';
import AppLayout from '@/components/TradeApp/AppLayout';
import TradeList from '@/components/TradeApp/TradeList';

export default function TradesPage() {
  return (
    <AppLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-8">
          <List className="w-8 h-8 text-[#2d8b8b]" />
          <h1 className="text-3xl font-bold font-heading text-slate-800">My Trades</h1>
        </div>
        <TradeList />
      </motion.div>
    </AppLayout>
  );
}
