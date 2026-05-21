"use client";

import { useState } from "react";
import { NetBarChart, MonthComparisonChart } from "./Charts";
import { MonthSelector } from "./MonthSelector";
import { formatCurrency, formatMonth, formatMonthShort, formatPercent } from "@/lib/formatters";
import { TrendingUp, TrendingDown, Minus, Lock, Shuffle, Scissors, PiggyBank } from "lucide-react";
import type { MonthlyData, MonthlySummary, Category } from "@/lib/types";

interface InsightsPageProps {
  months: string[];
  monthlyDataMap: Record<string, MonthlyData>;
  summaries: MonthlySummary[];
  categories: Category[];
  categoryColorMap: Record<string, string>;
  categoryNameMap: Record<string, string>;
}

const FIXED_CATEGORIES = new Set(["rent", "utilities", "insurance", "subscriptions", "fees", "kids"]);

export function InsightsPage({
  months,
  monthlyDataMap,
  summaries,
  categories,
  categoryColorMap,
  categoryNameMap,
}: InsightsPageProps) {
  const getCategoryColor = (key: string) => categoryColorMap[key] || "#757575";
  const getCategoryName = (key: string) => categoryNameMap[key] || key;
  const [selectedMonth, setSelectedMonth] = useState(months[0] || "");

  if (months.length === 0) {
    return (
      <div className="text-center py-24 text-gray-500">
        צריך לפחות חודש אחד של נתונים לתובנות.
      </div>
    );
  }

  const currentData = monthlyDataMap[selectedMonth];
  if (!currentData) return null;

  const trendData = [...summaries].reverse().map((s) => ({
    month: formatMonthShort(s.month),
    expenses: s.totalExpenses,
    income: s.totalIncome,
    net: s.net,
  }));

  // Savings rate
  const savingsRate = currentData.totalIncome > 0
    ? ((currentData.net / currentData.totalIncome) * 100)
    : 0;

  // Fixed vs variable expenses
  const fixedExpenses: { name: string; key: string; amount: number; color: string }[] = [];
  const variableExpenses: { name: string; key: string; amount: number; color: string }[] = [];

  for (const [key, amount] of Object.entries(currentData.byCategory)) {
    const entry = {
      name: getCategoryName(key),
      key,
      amount: Math.round(amount),
      color: getCategoryColor(key),
    };
    if (FIXED_CATEGORIES.has(key)) {
      fixedExpenses.push(entry);
    } else {
      variableExpenses.push(entry);
    }
  }
  fixedExpenses.sort((a, b) => b.amount - a.amount);
  variableExpenses.sort((a, b) => b.amount - a.amount);

  const totalFixed = fixedExpenses.reduce((s, e) => s + e.amount, 0);
  const totalVariable = variableExpenses.reduce((s, e) => s + e.amount, 0);

  // Category averages (for "where to cut" analysis)
  const categoryAvgMap: Record<string, number> = {};
  const otherMonths = months.filter((m) => m !== selectedMonth);
  if (otherMonths.length > 0) {
    const catTotals: Record<string, number[]> = {};
    for (const m of otherMonths) {
      const d = monthlyDataMap[m];
      if (!d) continue;
      for (const [cat, amount] of Object.entries(d.byCategory)) {
        if (!catTotals[cat]) catTotals[cat] = [];
        catTotals[cat].push(amount);
      }
    }
    for (const [cat, amounts] of Object.entries(catTotals)) {
      categoryAvgMap[cat] = amounts.reduce((a, b) => a + b, 0) / amounts.length;
    }
  }

  // Categories where spending is above average
  const aboveAverage = Object.entries(currentData.byCategory)
    .filter(([key]) => !FIXED_CATEGORIES.has(key))
    .map(([key, amount]) => {
      const avg = categoryAvgMap[key] || 0;
      const delta = avg > 0 ? ((amount - avg) / avg) * 100 : 0;
      return {
        name: getCategoryName(key),
        key,
        current: Math.round(amount),
        average: Math.round(avg),
        delta: Math.round(delta),
        color: getCategoryColor(key),
      };
    })
    .filter((c) => c.delta > 15 && c.average > 0)
    .sort((a, b) => b.delta - a.delta);

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
    .filter(([, v]) => v.count >= 2)
    .map(([merchant, v]) => ({ merchant, ...v }))
    .sort((a, b) => b.avgAmount - a.avgAmount);

  // Month comparison
  const currentIdx = months.indexOf(selectedMonth);
  const previousMonth = currentIdx < months.length - 1 ? months[currentIdx + 1] : null;
  let comparisonData: { category: string; current: number; previous: number; color: string }[] = [];
  let currentLabel = "";
  let previousLabel = "";

  if (previousMonth) {
    const previous = monthlyDataMap[previousMonth];
    currentLabel = formatMonth(selectedMonth);
    previousLabel = formatMonth(previousMonth);

    if (currentData && previous) {
      const allCats = new Set([
        ...Object.keys(currentData.byCategory),
        ...Object.keys(previous.byCategory),
      ]);
      comparisonData = Array.from(allCats)
        .map((key) => ({
          category: getCategoryName(key),
          current: Math.round(currentData.byCategory[key] || 0),
          previous: Math.round(previous.byCategory[key] || 0),
          color: getCategoryColor(key),
        }))
        .sort((a, b) => b.current - a.current);
    }
  }

  // Top categories with trend vs previous month
  const categoryTrends = Object.entries(currentData.byCategory)
    .map(([key, amount]) => {
      const prevAmount = previousMonth ? (monthlyDataMap[previousMonth]?.byCategory[key] || 0) : 0;
      const delta = prevAmount > 0 ? ((amount - prevAmount) / prevAmount) * 100 : 0;
      return {
        name: getCategoryName(key),
        key,
        amount: Math.round(amount),
        prevAmount: Math.round(prevAmount),
        delta: Math.round(delta),
        color: getCategoryColor(key),
      };
    })
    .sort((a, b) => b.amount - a.amount);

  return (
    <div className="space-y-4">
      <MonthSelector months={months} selected={selectedMonth} onChange={setSelectedMonth} />

      {/* Savings rate card */}
      <div className={`rounded-2xl p-4 border ${
        savingsRate >= 0
          ? "bg-emerald-950/20 border-emerald-800/30"
          : "bg-red-950/20 border-red-800/30"
      }`}>
        <div className="flex items-center gap-2 mb-2">
          <PiggyBank className={`w-5 h-5 ${savingsRate >= 0 ? "text-emerald-400" : "text-red-400"}`} />
          <span className="text-sm font-semibold text-gray-300">שיעור חיסכון</span>
        </div>
        <div className={`text-3xl font-bold ${savingsRate >= 0 ? "text-emerald-400" : "text-red-400"}`}>
          {savingsRate >= 0 ? "+" : ""}{formatPercent(savingsRate)}
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {savingsRate >= 0
            ? `חסכתם ${formatCurrency(currentData.net)} מתוך הכנסה של ${formatCurrency(currentData.totalIncome)}`
            : `הוצאתם ${formatCurrency(Math.abs(currentData.net))} מעבר להכנסה`
          }
        </p>
      </div>

      {/* Net bar chart */}
      {trendData.length > 1 && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
          <h3 className="text-sm font-semibold text-gray-300 mb-3">נטו חודשי</h3>
          <NetBarChart data={trendData} />
        </div>
      )}

      {/* Fixed expenses */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-gray-400" />
            <h3 className="text-sm font-semibold text-gray-300">הוצאות קבועות</h3>
          </div>
          <span className="text-sm font-bold text-gray-200">{formatCurrency(totalFixed)}</span>
        </div>
        <div className="space-y-3">
          {fixedExpenses.map((exp) => (
            <div key={exp.key}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: exp.color }} />
                  <span className="text-sm text-gray-300">{exp.name}</span>
                </div>
                <span className="text-sm font-medium text-gray-200">{formatCurrency(exp.amount)}</span>
              </div>
              <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden ms-[18px]">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${(exp.amount / totalFixed) * 100}%`,
                    backgroundColor: exp.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Variable expenses */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Shuffle className="w-4 h-4 text-gray-400" />
            <h3 className="text-sm font-semibold text-gray-300">הוצאות משתנות</h3>
          </div>
          <span className="text-sm font-bold text-gray-200">{formatCurrency(totalVariable)}</span>
        </div>
        <div className="space-y-3">
          {variableExpenses.map((exp) => (
            <div key={exp.key}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: exp.color }} />
                  <span className="text-sm text-gray-300">{exp.name}</span>
                </div>
                <span className="text-sm font-medium text-gray-200">{formatCurrency(exp.amount)}</span>
              </div>
              <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden ms-[18px]">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${totalVariable > 0 ? (exp.amount / totalVariable) * 100 : 0}%`,
                    backgroundColor: exp.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Where to cut */}
      {aboveAverage.length > 0 && (
        <div className="bg-amber-950/20 border border-amber-800/30 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Scissors className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-semibold text-amber-300">איפה אפשר לחסוך?</h3>
          </div>
          <p className="text-xs text-gray-500 mb-3">קטגוריות שבהן ההוצאה גבוהה מהממוצע</p>
          <div className="space-y-3">
            {aboveAverage.map((cat) => (
              <div key={cat.key} className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                  <span className="text-sm text-gray-300 truncate">{cat.name}</span>
                </div>
                <div className="flex items-center gap-3 shrink-0 ms-2">
                  <span className="text-xs text-gray-500">ממוצע: {formatCurrency(cat.average)}</span>
                  <span className="text-sm font-medium text-gray-200">{formatCurrency(cat.current)}</span>
                  <span className="text-xs font-bold text-red-400">+{cat.delta}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top categories with trend */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
        <h3 className="text-sm font-semibold text-gray-300 mb-3">קטגוריות מובילות</h3>
        <div className="space-y-2.5">
          {categoryTrends.slice(0, 8).map((cat) => (
            <div key={cat.key} className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                <span className="text-sm text-gray-300 truncate">{cat.name}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0 ms-2">
                <span className="text-sm font-medium text-gray-200">{formatCurrency(cat.amount)}</span>
                {previousMonth && cat.prevAmount > 0 && (
                  <span className={`flex items-center text-xs font-medium ${
                    cat.delta > 5 ? "text-red-400" : cat.delta < -5 ? "text-emerald-400" : "text-gray-500"
                  }`}>
                    {cat.delta > 5 ? <TrendingUp className="w-3 h-3 me-0.5" /> :
                     cat.delta < -5 ? <TrendingDown className="w-3 h-3 me-0.5" /> :
                     <Minus className="w-3 h-3 me-0.5" />}
                    {Math.abs(cat.delta)}%
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Month comparison */}
      {comparisonData.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
          <h3 className="text-sm font-semibold text-gray-300 mb-3">
            השוואה: {currentLabel} מול {previousLabel}
          </h3>
          <MonthComparisonChart
            data={comparisonData}
            currentLabel={currentLabel}
            previousLabel={previousLabel}
          />
        </div>
      )}

      {/* Recurring charges */}
      {recurring.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
          <h3 className="text-sm font-semibold text-gray-300 mb-3">חיובים חוזרים</h3>
          <div className="space-y-2.5">
            {recurring.slice(0, 12).map((r) => (
              <div key={r.merchant} className="flex items-center justify-between">
                <span className="text-sm text-gray-300 truncate">{r.merchant}</span>
                <div className="flex items-center gap-3 shrink-0 ms-2">
                  <span className="text-xs text-gray-500">{r.count}x</span>
                  <span className="text-sm font-medium text-gray-200">
                    {formatCurrency(r.avgAmount)}/חודש
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
