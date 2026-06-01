import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Target,
  BarChart3,
  Activity,
  Scale,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import AppLayout from '@/components/TradeApp/AppLayout';
import { useAuth } from '@/hooks/useAuth';
import { fetchTrades, formatCurrency } from '@/lib/supabase';
import { computeTradeStats } from '@/lib/tradeStats';

const KPI_CONFIG = [
  { key: 'totalTrades', label: 'Total Trades', icon: Activity, format: (v) => v },
  { key: 'netPnL', label: 'Net P&L', icon: TrendingUp, format: formatCurrency },
  { key: 'winRate', label: 'Win Rate', icon: Target, format: (v) => `${v.toFixed(1)}%` },
  { key: 'avgWin', label: 'Avg Win', icon: TrendingUp, format: formatCurrency },
  { key: 'avgLoss', label: 'Avg Loss', icon: TrendingDown, format: formatCurrency },
  { key: 'rrRatio', label: 'R:R Ratio', icon: Scale, format: (v) => (v === Infinity ? '∞' : v.toFixed(2)) },
];

function KpiCard({ label, value, icon: Icon, valueClass }) {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-400">{label}</CardTitle>
        <Icon className="w-4 h-4 text-emerald-500" />
      </CardHeader>
      <CardContent>
        <p className={`text-2xl font-bold ${valueClass || 'text-white'}`}>{value}</p>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();

  const { data: trades = [], isLoading, error } = useQuery({
    queryKey: ['trades', user?.id],
    queryFn: () => fetchTrades(user.id),
    enabled: Boolean(user?.id),
  });

  const stats = computeTradeStats(trades);

  const pieData = [
    { name: 'Wins', value: stats.wins, color: '#10b981' },
    { name: 'Losses', value: stats.losses, color: '#ef4444' },
  ].filter((d) => d.value > 0);

  const barData = [
    { name: 'Avg Profit', value: stats.avgWin, fill: '#10b981' },
    { name: 'Avg Loss', value: stats.avgLoss, fill: '#ef4444' },
  ];

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex justify-center py-24">
          <Spinner className="w-8 h-8 text-emerald-500" />
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="py-12 text-center text-red-400">
            Failed to load dashboard: {error.message}
          </CardContent>
        </Card>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-8">
          <BarChart3 className="w-8 h-8 text-emerald-500" />
          <h1 className="text-3xl font-bold font-heading text-white">Dashboard</h1>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          {KPI_CONFIG.map(({ key, label, icon, format }) => {
            const raw = stats[key];
            const isPnL = key === 'netPnL';
            const valueClass =
              isPnL && raw !== 0
                ? raw > 0
                  ? 'text-emerald-400'
                  : 'text-red-400'
                : 'text-white';

            return (
              <KpiCard
                key={key}
                label={label}
                icon={icon}
                value={format(raw)}
                valueClass={valueClass}
              />
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Win vs Loss</CardTitle>
            </CardHeader>
            <CardContent>
              {pieData.length === 0 ? (
                <p className="text-gray-400 text-center py-12">No trade data yet.</p>
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={4}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {pieData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1f2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#fff',
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Avg Profit vs Loss</CardTitle>
            </CardHeader>
            <CardContent>
              {stats.totalTrades === 0 ? (
                <p className="text-gray-400 text-center py-12">No trade data yet.</p>
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" tickFormatter={(v) => `₹${v}`} />
                    <Tooltip
                      formatter={(value) => formatCurrency(value)}
                      contentStyle={{
                        backgroundColor: '#1f2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#fff',
                      }}
                    />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                      {barData.map((entry) => (
                        <Cell key={entry.name} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </AppLayout>
  );
}
