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

const CARD = 'bg-white/90 backdrop-blur-sm border-teal-200/60 shadow-lg shadow-teal-900/5';

const CHART_TOOLTIP = {
  contentStyle: {
    backgroundColor: '#ffffff',
    border: '1px solid rgba(45, 139, 139, 0.25)',
    borderRadius: '8px',
    color: '#1e293b',
  },
};

const TEAL = '#2d8b8b';
const CORAL = '#f0544f';

function KpiCard({ label, value, icon: Icon, valueClass }) {
  return (
    <Card className={CARD}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-slate-500">{label}</CardTitle>
        <Icon className="w-4 h-4 text-[#2d8b8b]" />
      </CardHeader>
      <CardContent>
        <p className={`text-xl font-bold ${valueClass || 'text-slate-800'}`}>{value}</p>
      </CardContent>
    </Card>
  );
}

function TradeHighlight({ trade, type }) {
  const isBest = type === 'best';
  return (
    <div className="flex justify-between items-center py-2 border-b border-teal-100 last:border-0">
      <div>
        <p className="text-slate-800 font-medium">{trade.symbol}</p>
        <p className="text-xs text-slate-500">
          {trade.segment} · {format(new Date(trade.exit_time), 'dd MMM yyyy')}
        </p>
      </div>
      <span className={`font-semibold ${isBest ? 'text-[#2d8b8b]' : 'text-[#f0544f]'}`}>
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
    { name: 'Wins', value: stats.wins, color: TEAL },
    { name: 'Losses', value: stats.losses, color: CORAL },
  ].filter((d) => d.value > 0);

  const avgBarData = [
    { name: 'Avg Win', value: stats.avgWin, fill: TEAL },
    { name: 'Avg Loss', value: stats.avgLoss, fill: CORAL },
  ];

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex justify-center py-24">
          <Spinner className="w-8 h-8 text-[#2d8b8b]" />
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <Card className={CARD}>
          <CardContent className="py-12 text-center text-[#f0544f]">
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
          <BarChart3 className="w-8 h-8 text-[#2d8b8b]" />
          <h1 className="text-3xl font-bold font-heading text-slate-800">Dashboard</h1>
        </div>

        {/* KPI grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {KPI_CONFIG.map(({ key, label, icon, format }) => {
            const raw = stats[key];
            const isPnL = ['netPnL', 'largestWin', 'largestLoss'].includes(key);
            const valueClass =
              isPnL && raw !== 0
                ? raw > 0
                  ? 'text-[#2d8b8b]'
                  : 'text-[#f0544f]'
                : 'text-slate-800';

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
        <Card className={CARD}>
          <CardHeader>
            <CardTitle className="text-slate-800">Equity Curve</CardTitle>
          </CardHeader>
          <CardContent>
            {equityCurve.length === 0 ? (
              <p className="text-slate-500 text-center py-12">Log trades to see your equity curve.</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={equityCurve}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#64748b" tickFormatter={(v) => `₹${v}`} />
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
                    stroke={TEAL}
                    strokeWidth={2}
                    dot={{ fill: TEAL, r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className={CARD}>
            <CardHeader>
              <CardTitle className="text-slate-800">Win vs Loss</CardTitle>
            </CardHeader>
            <CardContent>
              {pieData.length === 0 ? (
                <p className="text-slate-500 text-center py-12">No trade data yet.</p>
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

          <Card className={CARD}>
            <CardHeader>
              <CardTitle className="text-slate-800">P&L by Segment</CardTitle>
            </CardHeader>
            <CardContent>
              {segmentData.length === 0 ? (
                <p className="text-slate-500 text-center py-12">No segment data yet.</p>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={segmentData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis type="number" stroke="#64748b" tickFormatter={(v) => `₹${v}`} />
                    <YAxis type="category" dataKey="segment" stroke="#64748b" width={100} tick={{ fontSize: 11 }} />
                    <Tooltip
                      formatter={(value) => formatCurrency(value)}
                      {...CHART_TOOLTIP}
                    />
                    <Bar dataKey="pnl" radius={[0, 4, 4, 0]}>
                      {segmentData.map((entry) => (
                        <Cell
                          key={entry.segment}
                          fill={entry.pnl >= 0 ? TEAL : CORAL}
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
          <Card className={CARD}>
            <CardHeader>
              <CardTitle className="text-slate-800">Avg Win vs Loss</CardTitle>
            </CardHeader>
            <CardContent>
              {stats.totalTrades === 0 ? (
                <p className="text-slate-500 text-center py-12">No data yet.</p>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={avgBarData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" stroke="#64748b" />
                    <YAxis stroke="#64748b" tickFormatter={(v) => `₹${v}`} />
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

          <Card className={CARD}>
            <CardHeader>
              <CardTitle className="text-slate-800 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-[#2d8b8b]" />
                Top Winners
              </CardTitle>
            </CardHeader>
            <CardContent>
              {best.length === 0 ? (
                <p className="text-slate-500 text-center py-8">
                  {trades.length > 0 ? 'No winning trades yet.' : 'No trades yet.'}
                </p>
              ) : (
                best.map((t) => <TradeHighlight key={t.id} trade={t} type="best" />)
              )}
            </CardContent>
          </Card>

          <Card className={CARD}>
            <CardHeader>
              <CardTitle className="text-slate-800 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-[#f0544f]" />
                Top Losers
              </CardTitle>
            </CardHeader>
            <CardContent>
              {worst.length === 0 ? (
                <p className="text-slate-500 text-center py-8">
                  {trades.length > 0 ? 'No losing trades yet.' : 'No trades yet.'}
                </p>
              ) : (
                worst.map((t) => <TradeHighlight key={t.id} trade={t} type="worst" />)
              )}
            </CardContent>
          </Card>
        </div>

        {/* Monthly summary */}
        <Card className={CARD}>
          <CardHeader>
            <CardTitle className="text-slate-800">Monthly Summary</CardTitle>
          </CardHeader>
          <CardContent>
            {monthlyData.length === 0 ? (
              <p className="text-slate-500 text-center py-8">No monthly data yet.</p>
            ) : (
              <>
                <div className="hidden md:block overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-teal-100 hover:bg-transparent">
                        <TableHead className="text-slate-500">Month</TableHead>
                        <TableHead className="text-slate-500">Trades</TableHead>
                        <TableHead className="text-slate-500">Win Rate</TableHead>
                        <TableHead className="text-slate-500">Net P&L</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {monthlyData.map((m) => (
                        <TableRow key={m.key} className="border-teal-100">
                          <TableCell className="text-slate-800">{m.label}</TableCell>
                          <TableCell className="text-slate-600">{m.trades}</TableCell>
                          <TableCell className="text-slate-600">{m.winRate.toFixed(1)}%</TableCell>
                          <TableCell className={m.pnl >= 0 ? 'text-[#2d8b8b]' : 'text-[#f0544f]'}>
                            {formatCurrency(m.pnl)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="md:hidden space-y-3">
                  {monthlyData.map((m) => (
                    <div key={m.key} className="bg-teal-50/50 rounded-lg p-4 border border-teal-200/60">
                      <div className="flex justify-between items-center">
                        <p className="text-slate-800 font-medium">{m.label}</p>
                        <span className={m.pnl >= 0 ? 'text-[#2d8b8b]' : 'text-[#f0544f]'}>
                          {formatCurrency(m.pnl)}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 mt-1">
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
