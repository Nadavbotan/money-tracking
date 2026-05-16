"use client";

import { SpendVsIncomeChart, MonthComparisonChart } from "./Charts";
import { formatCurrency, formatMonth, formatMonthShort } from "@/lib/formatters";
import type { MonthlyData, MonthlySummary, Category } from "@/lib/types";

interface TrendsPageProps {
  months: string[];
  monthlyDataMap: Record<string, MonthlyData>;
  summaries: MonthlySummary[];
  categories: Category[];
  categoryColorMap: Record<string, string>;
  categoryNameMap: Record<string, string>;
}

export function TrendsPage({
  months,
  monthlyDataMap,
  summaries,
  categories,
  categoryColorMap,
  categoryNameMap,
}: TrendsPageProps) {
  const getCategoryColor = (key: string) => categoryColorMap[key] || "#757575";
  const getCategoryName = (key: string) => categoryNameMap[key] || key;
  if (months.length === 0) {
    return (
      <div className="text-center py-24 text-gray-500">
        Need at least one month of data to show trends.
      </div>
    );
  }

  const trendData = [...summaries].reverse().map((s) => ({
    month: formatMonthShort(s.month),
    expenses: s.totalExpenses,
    income: s.totalIncome,
    net: s.net,
  }));

  // Category averages (across all months)
  const categoryTotals: Record<string, number[]> = {};
  for (const month of months) {
    const data = monthlyDataMap[month];
    if (!data) continue;
    for (const [cat, amount] of Object.entries(data.byCategory)) {
      if (!categoryTotals[cat]) categoryTotals[cat] = [];
      categoryTotals[cat].push(amount);
    }
  }

  const categoryAverages = Object.entries(categoryTotals)
    .map(([key, amounts]) => ({
      category: getCategoryName(key),
      average: Math.round(amounts.reduce((a, b) => a + b, 0) / amounts.length),
      color: getCategoryColor(key),
      months: amounts.length,
    }))
    .sort((a, b) => b.average - a.average);

  // Month comparison (latest vs previous)
  let comparisonData: {
    category: string;
    current: number;
    previous: number;
    color: string;
  }[] = [];
  let currentLabel = "";
  let previousLabel = "";

  if (months.length >= 2) {
    const current = monthlyDataMap[months[0]];
    const previous = monthlyDataMap[months[1]];
    currentLabel = formatMonth(months[0]);
    previousLabel = formatMonth(months[1]);

    if (current && previous) {
      const allCats = new Set([
        ...Object.keys(current.byCategory),
        ...Object.keys(previous.byCategory),
      ]);

      comparisonData = Array.from(allCats)
        .map((key) => ({
          category: getCategoryName(key),
          current: Math.round((current.byCategory[key] || 0) * 100) / 100,
          previous: Math.round((previous.byCategory[key] || 0) * 100) / 100,
          color: getCategoryColor(key),
        }))
        .sort((a, b) => b.current - a.current);
    }
  }

  // Recurring charges detection
  const merchantFrequency = new Map<string, { count: number; avgAmount: number; amounts: number[] }>();
  for (const month of months) {
    const data = monthlyDataMap[month];
    if (!data) continue;
    const seen = new Set<string>();
    for (const tx of data.transactions) {
      if (tx.type === "income" || seen.has(tx.merchant)) continue;
      seen.add(tx.merchant);
      const entry = merchantFrequency.get(tx.merchant) || { count: 0, avgAmount: 0, amounts: [] };
      entry.count++;
      entry.amounts.push(tx.charged_amount || tx.amount);
      entry.avgAmount = entry.amounts.reduce((a, b) => a + b, 0) / entry.amounts.length;
      merchantFrequency.set(tx.merchant, entry);
    }
  }

  const recurring = Array.from(merchantFrequency.entries())
    .filter(([, v]) => v.count >= 2 || (months.length === 1 && v.count === 1))
    .map(([merchant, v]) => ({ merchant, ...v }))
    .sort((a, b) => b.avgAmount - a.avgAmount);

  return (
    <div className="space-y-6">
      {trendData.length > 1 && (
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5">
          <h3 className="text-sm font-medium text-gray-300 mb-4">Income vs Expenses Trend</h3>
          <SpendVsIncomeChart data={trendData} />
        </div>
      )}

      {comparisonData.length > 0 && (
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5">
          <h3 className="text-sm font-medium text-gray-300 mb-4">
            Month Comparison: {currentLabel} vs {previousLabel}
          </h3>
          <MonthComparisonChart
            data={comparisonData}
            currentLabel={currentLabel}
            previousLabel={previousLabel}
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {categoryAverages.length > 0 && (
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5">
            <h3 className="text-sm font-medium text-gray-300 mb-4">Average Monthly Spend</h3>
            <div className="space-y-3">
              {categoryAverages.map((cat) => (
                <div key={cat.category} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="text-sm text-gray-300">{cat.category}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-200">
                    {formatCurrency(cat.average)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {recurring.length > 0 && (
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5">
            <h3 className="text-sm font-medium text-gray-300 mb-4">Recurring Charges</h3>
            <div className="space-y-3">
              {recurring.slice(0, 15).map((r) => (
                <div key={r.merchant} className="flex items-center justify-between">
                  <span className="text-sm text-gray-300 truncate">{r.merchant}</span>
                  <div className="flex items-center gap-3 shrink-0 ml-2">
                    <span className="text-xs text-gray-500">
                      {r.count}x
                    </span>
                    <span className="text-sm font-medium text-gray-200">
                      {formatCurrency(r.avgAmount)}/mo
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
