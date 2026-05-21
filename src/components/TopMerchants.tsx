"use client";

import { formatCurrency } from "@/lib/formatters";
import type { Transaction } from "@/lib/types";

interface TopMerchantsProps {
  transactions: Transaction[];
  limit?: number;
}

export function TopMerchants({ transactions, limit = 7 }: TopMerchantsProps) {
  const expenses = transactions.filter((t) => t.type === "expense");
  const merchantTotals = new Map<string, number>();

  for (const tx of expenses) {
    const current = merchantTotals.get(tx.merchant) || 0;
    merchantTotals.set(tx.merchant, current + (tx.charged_amount || tx.amount));
  }

  const sorted = Array.from(merchantTotals.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);

  if (sorted.length === 0) return null;

  const maxAmount = sorted[0][1];

  return (
    <div className="space-y-3">
      {sorted.map(([merchant, amount], i) => (
        <div key={merchant} className="flex items-center gap-3">
          <span className="text-xs text-gray-500 w-5 text-center font-mono">{i + 1}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-200 truncate">{merchant}</span>
              <span className="text-sm font-medium text-gray-300 shrink-0 ms-2">
                {formatCurrency(amount)}
              </span>
            </div>
            <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-l from-blue-500 to-blue-400 rounded-full transition-all duration-500"
                style={{ width: `${(amount / maxAmount) * 100}%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
