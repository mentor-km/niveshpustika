import { TRADE_SEGMENTS } from '@/lib/supabase';

export function computeTradeStats(trades = []) {
  if (!trades.length) {
    return {
      totalTrades: 0,
      netPnL: 0,
      winRate: 0,
      avgWin: 0,
      avgLoss: 0,
      rrRatio: 0,
      wins: 0,
      losses: 0,
      breakeven: 0,
      largestWin: 0,
      largestLoss: 0,
      profitFactor: 0,
    };
  }

  const pnls = trades.map((t) => Number(t.pnl));
  const wins = pnls.filter((p) => p > 0);
  const losses = pnls.filter((p) => p < 0);
  const breakeven = pnls.filter((p) => p === 0).length;

  const avgWin = wins.length ? wins.reduce((a, b) => a + b, 0) / wins.length : 0;
  const avgLoss = losses.length
    ? Math.abs(losses.reduce((a, b) => a + b, 0) / losses.length)
    : 0;

  const grossProfit = wins.reduce((a, b) => a + b, 0);
  const grossLoss = Math.abs(losses.reduce((a, b) => a + b, 0));

  return {
    totalTrades: trades.length,
    netPnL: pnls.reduce((a, b) => a + b, 0),
    winRate: (wins.length / trades.length) * 100,
    avgWin,
    avgLoss,
    rrRatio: avgLoss > 0 ? avgWin / avgLoss : avgWin > 0 ? Infinity : 0,
    wins: wins.length,
    losses: losses.length,
    breakeven,
    largestWin: wins.length ? Math.max(...wins) : 0,
    largestLoss: losses.length ? Math.min(...losses) : 0,
    profitFactor: grossLoss > 0 ? grossProfit / grossLoss : grossProfit > 0 ? Infinity : 0,
  };
}

export function computeEquityCurve(trades = []) {
  const sorted = [...trades].sort(
    (a, b) => new Date(a.exit_time) - new Date(b.exit_time)
  );

  let cumulative = 0;
  return sorted.map((trade, index) => {
    cumulative += Number(trade.pnl);
    return {
      trade: index + 1,
      date: new Date(trade.exit_time).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
      }),
      pnl: Number(trade.pnl),
      cumulative,
      symbol: trade.symbol,
    };
  });
}

export function computeSegmentBreakdown(trades = []) {
  const segments = [...TRADE_SEGMENTS, 'MCX Commodities', 'F&O', 'Commodity', 'Crypto'];

  const breakdown = segments.reduce((acc, seg) => {
    acc[seg] = { segment: seg, trades: 0, pnl: 0, wins: 0 };
    return acc;
  }, {});

  trades.forEach((trade) => {
    const seg = trade.segment;
    if (!breakdown[seg]) {
      breakdown[seg] = { segment: seg, trades: 0, pnl: 0, wins: 0 };
    }
    breakdown[seg].trades += 1;
    breakdown[seg].pnl += Number(trade.pnl);
    if (Number(trade.pnl) > 0) breakdown[seg].wins += 1;
  });

  return Object.values(breakdown)
    .filter((s) => s.trades > 0)
    .sort((a, b) => b.pnl - a.pnl);
}

export function computeMonthlySummary(trades = []) {
  const months = {};

  trades.forEach((trade) => {
    const date = new Date(trade.exit_time);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const label = date.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });

    if (!months[key]) {
      months[key] = { key, label, trades: 0, pnl: 0, wins: 0 };
    }
    months[key].trades += 1;
    months[key].pnl += Number(trade.pnl);
    if (Number(trade.pnl) > 0) months[key].wins += 1;
  });

  return Object.values(months)
    .sort((a, b) => b.key.localeCompare(a.key))
    .map((m) => ({
      ...m,
      winRate: m.trades > 0 ? (m.wins / m.trades) * 100 : 0,
    }));
}

export function getBestWorstTrades(trades = [], count = 3) {
  const best = [...trades]
    .filter((t) => Number(t.pnl) > 0)
    .sort((a, b) => Number(b.pnl) - Number(a.pnl))
    .slice(0, count);

  const worst = [...trades]
    .filter((t) => Number(t.pnl) < 0)
    .sort((a, b) => Number(a.pnl) - Number(b.pnl))
    .slice(0, count);

  return { best, worst };
}
