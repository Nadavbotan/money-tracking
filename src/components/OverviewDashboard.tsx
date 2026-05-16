"use client";

import { useState } from "react";
import { KpiCards, SpendVsIncomeBar } from "./KpiCards";
import { CategoryBreakdownChart, SpendVsIncomeChart, CategoryDonutChart } from "./Charts";
import { MonthSelector } from "./MonthSelector";
import { TopMerchants } from "./TopMerchants";
import type { MonthlyData, MonthlySummary, Category } from "@/lib/types";
import { formatMonthShort } from "@/lib/formatters";

interface OverviewDashboardProps {
  months: string[];
  monthlyDataMap: Record<string, MonthlyData>;
  summaries: MonthlySummary[];
  categories: Category[];
  categoryColorMap: Record<string, string>;
  categoryNameMap: Record<string, string>;
}

export function OverviewDashboard({
  months,
  monthlyDataMap,
  summaries,
  categories,
  categoryColorMap,
  categoryNameMap,
}: OverviewDashboardProps) {
  const getCategoryColor = (key: string) => categoryColorMap[key] || "#757575";
  const getCategoryName = (key: string) => categoryNameMap[key] || key;
  const [selectedMonth, setSelectedMonth] = useState(months[0] || "");

  if (months.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mb-4">
          <span className="text-2xl">📊</span>
        </div>
        <h2 className="text-xl font-semibold text-gray-200 mb-2">No data yet</h2>
        <p className="text-gray-500 max-w-md">
          Run the ingestion script to import your first month of transactions.
          Check the README for instructions.
        </p>
      </div>
    );
  }

  const data = monthlyDataMap[selectedMonth];
  if (!data) return null;

  const categoryData = Object.entries(data.byCategory)
    .map(([key, amount]) => ({
      name: getCategoryName(key),
      amount: Math.round(amount * 100) / 100,
      color: getCategoryColor(key),
    }))
    .sort((a, b) => b.amount - a.amount);

  const trendData = [...summaries].reverse().map((s) => ({
    month: formatMonthShort(s.month),
    expenses: s.totalExpenses,
    income: s.totalIncome,
    net: s.net,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <MonthSelector months={months} selected={selectedMonth} onChange={setSelectedMonth} />
      </div>

      <KpiCards
        totalIncome={data.totalIncome}
        totalExpenses={data.totalExpenses}
        net={data.net}
        transactionCount={data.transactions.length}
      />

      <SpendVsIncomeBar totalIncome={data.totalIncome} totalExpenses={data.totalExpenses} />

      {trendData.length > 1 && (
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5">
          <h3 className="text-sm font-medium text-gray-300 mb-4">Income vs Expenses Over Time</h3>
          <SpendVsIncomeChart data={trendData} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gray-800/50 border border-gray-700/50 rounded-xl p-5">
          <h3 className="text-sm font-medium text-gray-300 mb-4">Spending by Category</h3>
          <CategoryBreakdownChart data={categoryData} />
        </div>

        <div className="space-y-6">
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5">
            <h3 className="text-sm font-medium text-gray-300 mb-2">Distribution</h3>
            <CategoryDonutChart data={categoryData} total={data.totalExpenses} />
          </div>

          <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5">
            <h3 className="text-sm font-medium text-gray-300 mb-4">Top Merchants</h3>
            <TopMerchants transactions={data.transactions} />
          </div>
        </div>
      </div>
    </div>
  );
}
