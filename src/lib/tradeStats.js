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
    };
  }

  const pnls = trades.map((t) => Number(t.pnl));
  const wins = pnls.filter((p) => p > 0);
  const losses = pnls.filter((p) => p < 0);

  const avgWin = wins.length ? wins.reduce((a, b) => a + b, 0) / wins.length : 0;
  const avgLoss = losses.length
    ? Math.abs(losses.reduce((a, b) => a + b, 0) / losses.length)
    : 0;

  return {
    totalTrades: trades.length,
    netPnL: pnls.reduce((a, b) => a + b, 0),
    winRate: (wins.length / trades.length) * 100,
    avgWin,
    avgLoss,
    rrRatio: avgLoss > 0 ? avgWin / avgLoss : avgWin > 0 ? Infinity : 0,
    wins: wins.length,
    losses: losses.length,
  };
}
