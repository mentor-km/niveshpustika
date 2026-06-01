import React, { useEffect, useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import {
  TRADE_SEGMENTS,
  calculatePnL,
  createTrade,
  updateTrade,
  formatCurrency,
} from '@/lib/supabase';

const tradeSchema = z.object({
  segment: z.string().min(1, 'Select a segment'),
  symbol: z.string().min(1, 'Symbol is required'),
  entry_price: z.coerce.number().positive('Entry price must be positive'),
  exit_price: z.coerce.number().positive('Exit price must be positive'),
  quantity: z.coerce.number().int().positive('Quantity must be positive'),
  direction: z.enum(['long', 'short'], { required_error: 'Select direction' }),
  entry_time: z.string().min(1, 'Entry time is required'),
  exit_time: z.string().min(1, 'Exit time is required'),
});

function toDatetimeLocalValue(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 16);
}

export default function TradeForm({ trade, onSuccess, onCancel }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEditing = Boolean(trade?.id);

  const form = useForm({
    resolver: zodResolver(tradeSchema),
    defaultValues: {
      segment: trade?.segment ?? '',
      symbol: trade?.symbol ?? '',
      entry_price: trade?.entry_price ?? '',
      exit_price: trade?.exit_price ?? '',
      quantity: trade?.quantity ?? '',
      direction: trade?.direction ?? 'long',
      entry_time: toDatetimeLocalValue(trade?.entry_time) || toDatetimeLocalValue(new Date().toISOString()),
      exit_time: toDatetimeLocalValue(trade?.exit_time) || toDatetimeLocalValue(new Date().toISOString()),
    },
  });

  const watched = useWatch({ control: form.control });

  const pnl = useMemo(() => {
    const { direction, entry_price, exit_price, quantity } = watched;
    if (!entry_price || !exit_price || !quantity || !direction) return null;
    try {
      return calculatePnL({ direction, entry_price, exit_price, quantity });
    } catch {
      return null;
    }
  }, [watched]);

  const mutation = useMutation({
    mutationFn: async (values) => {
      const payload = {
        user_id: user.id,
        segment: values.segment,
        symbol: values.symbol.toUpperCase(),
        entry_price: values.entry_price,
        exit_price: values.exit_price,
        quantity: values.quantity,
        direction: values.direction,
        entry_time: new Date(values.entry_time).toISOString(),
        exit_time: new Date(values.exit_time).toISOString(),
        pnl: calculatePnL(values),
      };

      if (isEditing) {
        return updateTrade(trade.id, payload);
      }
      return createTrade(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trades'] });
      toast({
        title: isEditing ? 'Trade Updated' : 'Trade Saved',
        description: isEditing
          ? 'Your trade has been updated successfully.'
          : 'Your trade has been logged successfully.',
        className: 'bg-emerald-500 text-white',
      });
      form.reset();
      onSuccess?.();
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Save Failed',
        description: error.message || 'Could not save trade.',
      });
    },
  });

  useEffect(() => {
    if (trade) {
      form.reset({
        segment: trade.segment,
        symbol: trade.symbol,
        entry_price: trade.entry_price,
        exit_price: trade.exit_price,
        quantity: trade.quantity,
        direction: trade.direction,
        entry_time: toDatetimeLocalValue(trade.entry_time),
        exit_time: toDatetimeLocalValue(trade.exit_time),
      });
    }
  }, [trade, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((v) => mutation.mutate(v))} className="space-y-4">
        <FormField
          control={form.control}
          name="segment"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-300">Segment</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <SelectValue placeholder="Select segment" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-gray-800 border-gray-600 text-white">
                  {TRADE_SEGMENTS.map((seg) => (
                    <SelectItem key={seg} value={seg}>
                      {seg}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="symbol"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-300">Symbol</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. RELIANCE"
                  className="bg-gray-800 border-gray-600 text-white uppercase"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="entry_price"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">Entry Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    className="bg-gray-800 border-gray-600 text-white"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="exit_price"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">Exit Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    className="bg-gray-800 border-gray-600 text-white"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">Quantity</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    className="bg-gray-800 border-gray-600 text-white"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="direction"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">Direction</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                      <SelectValue placeholder="Direction" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-gray-800 border-gray-600 text-white">
                    <SelectItem value="long">Long</SelectItem>
                    <SelectItem value="short">Short</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="entry_time"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">Entry Time</FormLabel>
                <FormControl>
                  <Input
                    type="datetime-local"
                    className="bg-gray-800 border-gray-600 text-white"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="exit_time"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">Exit Time</FormLabel>
                <FormControl>
                  <Input
                    type="datetime-local"
                    className="bg-gray-800 border-gray-600 text-white"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {pnl !== null && (
          <div
            className={`rounded-lg p-3 text-center font-semibold ${
              pnl >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
            }`}
          >
            Calculated P&L: {formatCurrency(pnl)}
          </div>
        )}

        <div className="flex gap-3 pt-2">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              className="flex-1 border-gray-600 text-gray-300"
              onClick={onCancel}
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            disabled={mutation.isPending}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
          >
            {mutation.isPending ? <Spinner className="mr-2" /> : null}
            {isEditing ? 'Update Trade' : 'Save Trade'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
