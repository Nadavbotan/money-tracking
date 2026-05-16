"use client";

import { TrendingUp, TrendingDown, Wallet, ArrowUpDown } from "lucide-react";
import { formatCurrency } from "@/lib/formatters";

interface KpiCardsProps {
  totalIncome: number;
  totalExpenses: number;
  net: number;
  transactionCount: number;
}

export function KpiCards({ totalIncome, totalExpenses, net, transactionCount }: KpiCardsProps) {
  const cards = [
    {
      label: "Income",
      value: formatCurrency(totalIncome),
      icon: TrendingUp,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
    {
      label: "Expenses",
      value: formatCurrency(totalExpenses),
      icon: TrendingDown,
      color: "text-red-400",
      bg: "bg-red-500/10",
      border: "border-red-500/20",
    },
    {
      label: "Net",
      value: formatCurrency(net),
      icon: Wallet,
      color: net >= 0 ? "text-emerald-400" : "text-red-400",
      bg: net >= 0 ? "bg-emerald-500/10" : "bg-red-500/10",
      border: net >= 0 ? "border-emerald-500/20" : "border-red-500/20",
    },
    {
      label: "Transactions",
      value: transactionCount.toString(),
      icon: ArrowUpDown,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`${card.bg} ${card.border} border rounded-xl p-5 transition-all hover:scale-[1.02]`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-400 font-medium">{card.label}</span>
            <card.icon className={`w-5 h-5 ${card.color}`} />
          </div>
          <div className={`text-2xl font-bold ${card.color}`}>{card.value}</div>
        </div>
      ))}
    </div>
  );
}

interface SpendVsIncomeBarProps {
  totalIncome: number;
  totalExpenses: number;
}

export function SpendVsIncomeBar({ totalIncome, totalExpenses }: SpendVsIncomeBarProps) {
  const total = totalIncome + totalExpenses;
  if (total === 0) return null;
  const incomePercent = (totalIncome / total) * 100;
  const expensePercent = (totalExpenses / total) * 100;

  return (
    <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5">
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm font-medium text-gray-300">Spend vs Income</span>
        <span
          className={`text-sm font-semibold ${
            totalIncome >= totalExpenses ? "text-emerald-400" : "text-red-400"
          }`}
        >
          {totalIncome >= totalExpenses ? "+" : ""}
          {formatCurrency(totalIncome - totalExpenses)}
        </span>
      </div>
      <div className="flex h-4 rounded-full overflow-hidden bg-gray-900">
        <div
          className="bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-700"
          style={{ width: `${incomePercent}%` }}
        />
        <div
          className="bg-gradient-to-r from-red-500 to-red-400 transition-all duration-700"
          style={{ width: `${expensePercent}%` }}
        />
      </div>
      <div className="flex justify-between mt-2 text-xs text-gray-500">
        <span>Income: {formatCurrency(totalIncome)} ({incomePercent.toFixed(0)}%)</span>
        <span>Expenses: {formatCurrency(totalExpenses)} ({expensePercent.toFixed(0)}%)</span>
      </div>
    </div>
  );
}
