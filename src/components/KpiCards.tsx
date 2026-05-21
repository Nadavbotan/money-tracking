"use client";

import { TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { formatCurrency } from "@/lib/formatters";

interface KpiCardsProps {
  totalIncome: number;
  totalExpenses: number;
  net: number;
  transactionCount: number;
}

export function KpiCards({ totalIncome, totalExpenses, net }: KpiCardsProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 text-center">
        <TrendingUp className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
        <div className="text-xl font-bold text-emerald-400">{formatCurrency(totalIncome)}</div>
        <div className="text-xs text-gray-500 mt-1">הכנסות</div>
      </div>
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 text-center">
        <TrendingDown className="w-5 h-5 text-red-400 mx-auto mb-2" />
        <div className="text-xl font-bold text-red-400">{formatCurrency(totalExpenses)}</div>
        <div className="text-xs text-gray-500 mt-1">הוצאות</div>
      </div>
      <div className={`border rounded-2xl p-4 text-center ${
        net >= 0
          ? "bg-emerald-950/30 border-emerald-800/50"
          : "bg-red-950/30 border-red-800/50"
      }`}>
        <Wallet className={`w-5 h-5 mx-auto mb-2 ${net >= 0 ? "text-emerald-400" : "text-red-400"}`} />
        <div className={`text-xl font-bold ${net >= 0 ? "text-emerald-400" : "text-red-400"}`}>
          {net >= 0 ? "+" : ""}{formatCurrency(net)}
        </div>
        <div className="text-xs text-gray-500 mt-1">נטו</div>
      </div>
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
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm font-medium text-gray-300">הוצאות מול הכנסות</span>
        <span
          className={`text-sm font-bold ${
            totalIncome >= totalExpenses ? "text-emerald-400" : "text-red-400"
          }`}
        >
          {totalIncome >= totalExpenses ? "+" : ""}
          {formatCurrency(totalIncome - totalExpenses)}
        </span>
      </div>
      <div className="flex h-3 rounded-full overflow-hidden bg-gray-800">
        <div
          className="bg-gradient-to-l from-emerald-500 to-emerald-400 transition-all duration-700"
          style={{ width: `${incomePercent}%` }}
        />
        <div
          className="bg-gradient-to-l from-red-500 to-red-400 transition-all duration-700"
          style={{ width: `${expensePercent}%` }}
        />
      </div>
      <div className="flex justify-between mt-2 text-xs text-gray-500">
        <span>הכנסות: {formatCurrency(totalIncome)} ({incomePercent.toFixed(0)}%)</span>
        <span>הוצאות: {formatCurrency(totalExpenses)} ({expensePercent.toFixed(0)}%)</span>
      </div>
    </div>
  );
}
