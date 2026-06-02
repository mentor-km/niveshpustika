import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
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
  Trophy,
  AlertTriangle,
} from 'lucide-react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Spinner } from '@/components/ui/spinner';
import AppLayout from '@/components/TradeApp/AppLayout';
import { useAuth } from '@/hooks/useAuth';
import { fetchTrades, formatCurrency } from '@/lib/supabase';
import {
  computeTradeStats,
  computeEquityCurve,
  computeSegmentBreakdown,
  computeMonthlySummary,
  getBestWorstTrades,
} from '@/lib/tradeStats';

const KPI_CONFIG = [
  { key: 'totalTrades', label: 'Total Trades', icon: Activity, format: (v) => v },
  { key: 'netPnL', label: 'Net P&L', icon: TrendingUp, format: formatCurrency },
  { key: 'winRate', label: 'Win Rate', icon: Target, format: (v) => `${v.toFixed(1)}%` },
  { key: 'profitFactor', label: 'Profit Factor', icon: Scale, format: (v) => (v === Infinity ? '∞' : v.toFixed(2)) },
  { key: 'avgWin', label: 'Avg Win', icon: TrendingUp, format: formatCurrency },
  { key: 'avgLoss', label: 'Avg Loss', icon: TrendingDown, format: formatCurrency },
  { key: 'largestWin', label: 'Best Trade', icon: Trophy, format: formatCurrency },
  { key: 'largestLoss', label: 'Worst Trade', icon: AlertTriangle, format: formatCurrency },
];

const CHART_TOOLTIP = {
  contentStyle: {
    backgroundColor: '#1f2937',
    border: '1px solid #374151',
    borderRadius: '8px',
    color: '#fff',
  },
};

function KpiCard({ label, value, icon: Icon, valueClass }) {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-400">{label}</CardTitle>
        <Icon className="w-4 h-4 text-emerald-500" />
      </CardHeader>
      <CardContent>
        <p className={`text-xl font-bold ${valueClass || 'text-white'}`}>{value}</p>
      </CardContent>
    </Card>
  );
}

function TradeHighlight({ trade, type }) {
  const isBest = type === 'best';
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-700 last:border-0">
      <div>
        <p className="text-white font-medium">{trade.symbol}</p>
        <p className="text-xs text-gray-500">
          {trade.segment} · {format(new Date(trade.exit_time), 'dd MMM yyyy')}
        </p>
      </div>
      <span className={`font-semibold ${isBest ? 'text-emerald-400' : 'text-red-400'}`}>
        {formatCurrency(trade.pnl)}
      </span>
    </div>
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
  const equityCurve = computeEquityCurve(trades);
  const segmentData = computeSegmentBreakdown(trades);
  const monthlyData = computeMonthlySummary(trades);
  const { best, worst } = getBestWorstTrades(trades);

  const pieData = [
    { name: 'Wins', value: stats.wins, color: '#10b981' },
    { name: 'Losses', value: stats.losses, color: '#ef4444' },
  ].filter((d) => d.value > 0);

  const avgBarData = [
    { name: 'Avg Win', value: stats.avgWin, fill: '#10b981' },
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
        className="space-y-8"
      >
        <div className="flex items-center gap-3">
          <BarChart3 className="w-8 h-8 text-emerald-500" />
          <h1 className="text-3xl font-bold font-heading text-white">Dashboard</h1>
        </div>

        {/* KPI grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {KPI_CONFIG.map(({ key, label, icon, format }) => {
            const raw = stats[key];
            const isPnL = ['netPnL', 'largestWin', 'largestLoss'].includes(key);
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

        {/* Equity curve - full width */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Equity Curve</CardTitle>
          </CardHeader>
          <CardContent>
            {equityCurve.length === 0 ? (
              <p className="text-gray-400 text-center py-12">Log trades to see your equity curve.</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={equityCurve}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9ca3af" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#9ca3af" tickFormatter={(v) => `₹${v}`} />
                  <Tooltip
                    formatter={(value, name) =>
                      name === 'cumulative' ? [formatCurrency(value), 'Cumulative P&L'] : [formatCurrency(value), 'Trade P&L']
                    }
                    labelFormatter={(_, payload) =>
                      payload?.[0]?.payload
                        ? `${payload[0].payload.symbol} · Trade #${payload[0].payload.trade}`
                        : ''
                    }
                    {...CHART_TOOLTIP}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="cumulative"
                    name="Cumulative P&L"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ fill: '#10b981', r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Win vs Loss</CardTitle>
            </CardHeader>
            <CardContent>
              {pieData.length === 0 ? (
                <p className="text-gray-400 text-center py-12">No trade data yet.</p>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={90}
                      paddingAngle={4}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {pieData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip {...CHART_TOOLTIP} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">P&L by Segment</CardTitle>
            </CardHeader>
            <CardContent>
              {segmentData.length === 0 ? (
                <p className="text-gray-400 text-center py-12">No segment data yet.</p>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={segmentData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis type="number" stroke="#9ca3af" tickFormatter={(v) => `₹${v}`} />
                    <YAxis type="category" dataKey="segment" stroke="#9ca3af" width={100} tick={{ fontSize: 11 }} />
                    <Tooltip
                      formatter={(value) => formatCurrency(value)}
                      {...CHART_TOOLTIP}
                    />
                    <Bar dataKey="pnl" radius={[0, 4, 4, 0]}>
                      {segmentData.map((entry) => (
                        <Cell
                          key={entry.segment}
                          fill={entry.pnl >= 0 ? '#10b981' : '#ef4444'}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Avg win/loss + best/worst */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Avg Win vs Loss</CardTitle>
            </CardHeader>
            <CardContent>
              {stats.totalTrades === 0 ? (
                <p className="text-gray-400 text-center py-12">No data yet.</p>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={avgBarData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" tickFormatter={(v) => `₹${v}`} />
                    <Tooltip formatter={(value) => formatCurrency(value)} {...CHART_TOOLTIP} />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                      {avgBarData.map((entry) => (
                        <Cell key={entry.name} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-emerald-500" />
                Top Winners
              </CardTitle>
            </CardHeader>
            <CardContent>
              {best.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No trades yet.</p>
              ) : (
                best.map((t) => <TradeHighlight key={t.id} trade={t} type="best" />)
              )}
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                Top Losers
              </CardTitle>
            </CardHeader>
            <CardContent>
              {worst.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No trades yet.</p>
              ) : (
                worst.map((t) => <TradeHighlight key={t.id} trade={t} type="worst" />)
              )}
            </CardContent>
          </Card>
        </div>

        {/* Monthly summary */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Monthly Summary</CardTitle>
          </CardHeader>
          <CardContent>
            {monthlyData.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No monthly data yet.</p>
            ) : (
              <>
                <div className="hidden md:block overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-700 hover:bg-transparent">
                        <TableHead className="text-gray-400">Month</TableHead>
                        <TableHead className="text-gray-400">Trades</TableHead>
                        <TableHead className="text-gray-400">Win Rate</TableHead>
                        <TableHead className="text-gray-400">Net P&L</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {monthlyData.map((m) => (
                        <TableRow key={m.key} className="border-gray-700">
                          <TableCell className="text-white">{m.label}</TableCell>
                          <TableCell className="text-gray-300">{m.trades}</TableCell>
                          <TableCell className="text-gray-300">{m.winRate.toFixed(1)}%</TableCell>
                          <TableCell className={m.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                            {formatCurrency(m.pnl)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="md:hidden space-y-3">
                  {monthlyData.map((m) => (
                    <div key={m.key} className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                      <div className="flex justify-between items-center">
                        <p className="text-white font-medium">{m.label}</p>
                        <span className={m.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                          {formatCurrency(m.pnl)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {m.trades} trades · {m.winRate.toFixed(1)}% win rate
                      </p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </AppLayout>
  );
}
