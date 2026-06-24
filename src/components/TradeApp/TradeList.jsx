import React, { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import TradeForm from '@/components/TradeApp/TradeForm';
import {
  TRADE_SEGMENTS,
  deleteTrade,
  fetchTrades,
  formatCurrency,
} from '@/lib/supabase';

const CARD = 'bg-white/90 backdrop-blur-sm border-teal-200/60 shadow-lg shadow-teal-900/5';

export default function TradeList({ userId: overrideUserId }) {
  const { user } = useAuth();
  const userId = overrideUserId ?? user?.id;
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [segmentFilter, setSegmentFilter] = useState('all');
  const [editingTrade, setEditingTrade] = useState(null);
  const [deletingTrade, setDeletingTrade] = useState(null);

  const { data: trades = [], isLoading, error } = useQuery({
    queryKey: ['trades', userId],
    queryFn: () => fetchTrades(userId),
    enabled: Boolean(userId),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteTrade(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trades'] });
      toast({
        title: 'Trade Deleted',
        description: 'The trade has been removed.',
        className: 'bg-[#2d8b8b] text-white',
      });
      setDeletingTrade(null);
    },
    onError: (err) => {
      toast({
        variant: 'destructive',
        title: 'Delete Failed',
        description: err.message || 'Could not delete trade.',
      });
    },
  });

  const filteredTrades = useMemo(() => {
    if (segmentFilter === 'all') return trades;
    return trades.filter((t) => t.segment === segmentFilter);
  }, [trades, segmentFilter]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner className="w-8 h-8 text-[#2d8b8b]" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className={CARD}>
        <CardContent className="py-8 text-center text-[#f0544f]">
          Failed to load trades: {error.message}
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className={CARD}>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="text-slate-800">Trade History</CardTitle>
          <Select value={segmentFilter} onValueChange={setSegmentFilter}>
            <SelectTrigger className="w-full sm:w-48 bg-white border-teal-200 text-slate-800">
              <SelectValue placeholder="Filter by segment" />
            </SelectTrigger>
            <SelectContent className="bg-white border-teal-200 text-slate-800">
              <SelectItem value="all">All Segments</SelectItem>
              {TRADE_SEGMENTS.map((seg) => (
                <SelectItem key={seg} value={seg}>
                  {seg}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          {filteredTrades.length === 0 ? (
            <p className="text-center text-slate-500 py-8">
              No trades found. Add your first trade to get started.
            </p>
          ) : (
            <>
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-teal-100 hover:bg-transparent">
                      <TableHead className="text-slate-500">Date</TableHead>
                      <TableHead className="text-slate-500">Symbol</TableHead>
                      <TableHead className="text-slate-500">Direction</TableHead>
                      <TableHead className="text-slate-500">Qty</TableHead>
                      <TableHead className="text-slate-500">Entry</TableHead>
                      <TableHead className="text-slate-500">Exit</TableHead>
                      <TableHead className="text-slate-500">P&L</TableHead>
                      <TableHead className="text-slate-500 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTrades.map((trade) => (
                      <TableRow key={trade.id} className="border-teal-100">
                        <TableCell className="text-slate-600">
                          {format(new Date(trade.entry_time), 'dd MMM yyyy')}
                        </TableCell>
                        <TableCell className="text-slate-800 font-medium">{trade.symbol}</TableCell>
                        <TableCell>
                          <span
                            className={`capitalize text-xs px-2 py-1 rounded-full ${
                              trade.direction === 'long'
                                ? 'bg-teal-100 text-[#2d8b8b]'
                                : 'bg-red-100 text-[#f0544f]'
                            }`}
                          >
                            {trade.direction}
                          </span>
                        </TableCell>
                        <TableCell className="text-slate-600">{trade.quantity}</TableCell>
                        <TableCell className="text-slate-600">{trade.entry_price}</TableCell>
                        <TableCell className="text-slate-600">{trade.exit_price}</TableCell>
                        <TableCell
                          className={Number(trade.pnl) >= 0 ? 'text-[#2d8b8b]' : 'text-[#f0544f]'}
                        >
                          {formatCurrency(trade.pnl)}
                        </TableCell>
                        <TableCell className="text-right">
                          {!overrideUserId && (
                            <div className="flex justify-end gap-2">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="text-slate-400 hover:text-[#2d8b8b]"
                                onClick={() => setEditingTrade(trade)}
                              >
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="text-slate-400 hover:text-[#f0544f]"
                                onClick={() => setDeletingTrade(trade)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="md:hidden space-y-3">
                {filteredTrades.map((trade) => (
                  <div
                    key={trade.id}
                    className="bg-teal-50/50 rounded-lg p-4 border border-teal-200/60"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-slate-800 font-semibold">{trade.symbol}</p>
                        <p className="text-xs text-slate-500">
                          {format(new Date(trade.entry_time), 'dd MMM yyyy')} · {trade.segment}
                        </p>
                      </div>
                      <span
                        className={`text-sm font-semibold ${
                          Number(trade.pnl) >= 0 ? 'text-[#2d8b8b]' : 'text-[#f0544f]'
                        }`}
                      >
                        {formatCurrency(trade.pnl)}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs text-slate-500 mb-3">
                      <div>
                        <span className="block text-slate-400">Dir</span>
                        <span className="capitalize text-slate-600">{trade.direction}</span>
                      </div>
                      <div>
                        <span className="block text-slate-400">Entry</span>
                        <span className="text-slate-600">{trade.entry_price}</span>
                      </div>
                      <div>
                        <span className="block text-slate-400">Exit</span>
                        <span className="text-slate-600">{trade.exit_price}</span>
                      </div>
                    </div>
                    {!overrideUserId && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 border-teal-200 text-slate-600 hover:bg-teal-50 hover:!text-slate-800"
                          onClick={() => setEditingTrade(trade)}
                        >
                          <Pencil className="w-3 h-3 mr-1" /> Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 border-red-200 text-[#f0544f] hover:bg-red-50 hover:!text-[#f0544f]"
                          onClick={() => setDeletingTrade(trade)}
                        >
                          <Trash2 className="w-3 h-3 mr-1" /> Delete
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={Boolean(editingTrade)} onOpenChange={() => setEditingTrade(null)}>
        <DialogContent className="bg-white border-teal-200/60 text-slate-800 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-slate-800">Edit Trade</DialogTitle>
          </DialogHeader>
          {editingTrade && (
            <TradeForm
              trade={editingTrade}
              onSuccess={() => setEditingTrade(null)}
              onCancel={() => setEditingTrade(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={Boolean(deletingTrade)} onOpenChange={() => setDeletingTrade(null)}>
        <AlertDialogContent className="bg-white border-teal-200/60 text-slate-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-slate-800">Delete Trade</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500">
              Are you sure you want to delete the {deletingTrade?.symbol} trade? This cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-teal-200 text-slate-600 hover:bg-teal-50 hover:!text-slate-800">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-[#f0544f] hover:bg-[#d94540] text-white"
              onClick={() => deleteMutation.mutate(deletingTrade.id)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? <Spinner className="mr-2" /> : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
