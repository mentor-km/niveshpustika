import React, { useEffect, useMemo, useRef } from 'react';
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
  isEquitySegment,
  effectiveQuantity,
  dateInputToIso,
  isoToDateInput,
} from '@/lib/supabase';
import SymbolSearch from '@/components/TradeApp/SymbolSearch';

const tradeSchema = z
  .object({
    segment: z.string().min(1, 'Select a segment'),
    symbol: z.string().min(1, 'Symbol is required'),
    entry_price: z.coerce.number().positive('Entry price must be positive'),
    exit_price: z.coerce.number().positive('Exit price must be positive'),
    direction: z.enum(['long', 'short'], { required_error: 'Select direction' }),
    entry_date: z.string().min(1, 'Entry date is required'),
    exit_date: z.string().min(1, 'Exit date is required'),
    quantity: z.coerce.number().optional(),
    lot_size: z.coerce.number().optional(),
    lots: z.coerce.number().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.entry_date && data.exit_date && data.exit_date < data.entry_date) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Exit date must be on or after entry date',
        path: ['exit_date'],
      });
    }

    if (isEquitySegment(data.segment)) {
      if (!data.quantity || data.quantity <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Number of shares is required',
          path: ['quantity'],
        });
      }
    } else if (data.segment) {
      if (!data.lot_size || data.lot_size <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Lot size is required',
          path: ['lot_size'],
        });
      }
      if (!data.lots || data.lots <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Number of lots is required',
          path: ['lots'],
        });
      }
    }
  });

const inputClass = 'bg-white border-teal-200 text-slate-800 text-base md:text-sm';
const labelClass = 'text-slate-600';
const selectContentClass = 'bg-white border-teal-200 text-slate-800';
const selectTriggerClass = `${inputClass} h-10`;

function tradeToFormValues(trade) {
  if (!trade) {
    const today = isoToDateInput(new Date().toISOString());
    return {
      segment: '',
      symbol: '',
      entry_price: '',
      exit_price: '',
      direction: 'long',
      entry_date: today,
      exit_date: today,
      quantity: '',
      lot_size: '',
      lots: '',
    };
  }

  const isEquity = isEquitySegment(trade.segment);
  return {
    segment: trade.segment,
    symbol: trade.symbol,
    entry_price: trade.entry_price,
    exit_price: trade.exit_price,
    direction: trade.direction,
    entry_date: isoToDateInput(trade.entry_time),
    exit_date: isoToDateInput(trade.exit_time),
    quantity: isEquity ? trade.quantity : '',
    lot_size: !isEquity && trade.lot_size != null ? trade.lot_size : '',
    lots: !isEquity && trade.lots != null ? trade.lots : '',
  };
}

function buildPayload(userId, values) {
  const qty = effectiveQuantity(values);
  const isEquity = isEquitySegment(values.segment);

  return {
    user_id: userId,
    segment: values.segment,
    symbol: values.symbol.toUpperCase(),
    entry_price: values.entry_price,
    exit_price: values.exit_price,
    quantity: qty,
    lot_size: isEquity ? null : values.lot_size,
    lots: isEquity ? null : values.lots,
    direction: values.direction,
    entry_time: dateInputToIso(values.entry_date),
    exit_time: dateInputToIso(values.exit_date),
    pnl: calculatePnL({ ...values, quantity: qty }),
  };
}

export default function TradeForm({ trade, onSuccess, onCancel }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEditing = Boolean(trade?.id);
  const symbolSearchRef = useRef(null);

  const closeSymbolSearch = () => symbolSearchRef.current?.close();

  const form = useForm({
    resolver: zodResolver(tradeSchema),
    defaultValues: tradeToFormValues(trade),
  });

  const watched = useWatch({ control: form.control });
  const isEquity = isEquitySegment(watched.segment);

  const pnl = useMemo(() => {
    const { direction, entry_price, exit_price, segment, quantity, lot_size, lots } = watched;
    if (!entry_price || !exit_price || !direction || !segment) return null;
    try {
      const qty = effectiveQuantity({ segment, quantity, lot_size, lots });
      if (!qty || qty <= 0) return null;
      return calculatePnL({ direction, entry_price, exit_price, segment, quantity, lot_size, lots });
    } catch {
      return null;
    }
  }, [watched]);

  const mutation = useMutation({
    mutationFn: async (values) => {
      const payload = buildPayload(user.id, values);
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
        className: 'bg-[#2d8b8b] text-white',
      });
      form.reset(tradeToFormValues(null));
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
      form.reset(tradeToFormValues(trade));
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
              <FormLabel className={labelClass}>Segment</FormLabel>
              <Select
                onOpenChange={(isOpen) => {
                  if (isOpen) closeSymbolSearch();
                }}
                onValueChange={(val) => {
                  closeSymbolSearch();
                  field.onChange(val);
                  form.setValue('symbol', '');
                  form.setValue('quantity', '');
                  form.setValue('lot_size', '');
                  form.setValue('lots', '');
                }}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger className={selectTriggerClass}>
                    <SelectValue placeholder="Select segment" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className={selectContentClass}>
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
              <FormLabel className={labelClass}>Symbol</FormLabel>
              <FormControl>
                <SymbolSearch
                  ref={symbolSearchRef}
                  segment={watched.segment}
                  value={field.value}
                  onChange={field.onChange}
                  onSelectInstrument={(inst) => {
                    if (!isEquitySegment(watched.segment) && inst.lot_size) {
                      form.setValue('lot_size', inst.lot_size);
                    }
                  }}
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
                <FormLabel className={labelClass}>Entry Price</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" className={inputClass} {...field} />
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
                <FormLabel className={labelClass}>Exit Price</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" className={inputClass} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {!watched.segment ? (
          <p className="text-sm text-slate-500 rounded-lg bg-teal-50/80 border border-teal-100 px-3 py-2">
            Select a segment to enter size and direction.
          </p>
        ) : isEquity ? (
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={labelClass}>No. of Shares</FormLabel>
                  <FormControl>
                    <Input type="number" min="1" className={inputClass} {...field} />
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
                  <FormLabel className={labelClass}>Direction</FormLabel>
                  <Select
                    onOpenChange={(isOpen) => {
                      if (isOpen) closeSymbolSearch();
                    }}
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className={selectTriggerClass}>
                        <SelectValue placeholder="Direction" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className={selectContentClass}>
                      <SelectItem value="long">Long</SelectItem>
                      <SelectItem value="short">Short</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="lot_size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelClass}>Lot Size</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" className={inputClass} placeholder="e.g. 50" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lots"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelClass}>No. of Lots</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" className={inputClass} placeholder="e.g. 2" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="direction"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={labelClass}>Direction</FormLabel>
                  <Select
                    onOpenChange={(isOpen) => {
                      if (isOpen) closeSymbolSearch();
                    }}
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className={selectTriggerClass}>
                        <SelectValue placeholder="Direction" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className={selectContentClass}>
                      <SelectItem value="long">Long</SelectItem>
                      <SelectItem value="short">Short</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="entry_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={labelClass}>Entry Date</FormLabel>
                <FormControl>
                  <Input type="date" className={inputClass} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="exit_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={labelClass}>Exit Date</FormLabel>
                <FormControl>
                  <Input type="date" className={inputClass} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {pnl !== null && (
          <div
            className={`rounded-lg p-3 text-center font-semibold ${
              pnl >= 0 ? 'bg-teal-50 text-[#2d8b8b]' : 'bg-red-50 text-[#f0544f]'
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
              className="flex-1 border-teal-200 text-slate-600 hover:bg-teal-50 hover:text-slate-800"
              onClick={onCancel}
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            disabled={mutation.isPending}
            className="flex-1 bg-[#2d8b8b] hover:bg-[#267a7a] text-white font-bold"
          >
            {mutation.isPending ? <Spinner className="mr-2" /> : null}
            {isEditing ? 'Update Trade' : 'Save Trade'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
