"use client";

import { useState } from "react";
import { Download, RotateCcw } from "lucide-react";
import { MonthSelector } from "./MonthSelector";
import { TransactionList } from "./TransactionList";
import type { MonthlyData, Category } from "@/lib/types";
import { useMonth } from "@/lib/MonthContext";

interface TransactionsPageProps {
  months: string[];
  monthlyDataMap: Record<string, MonthlyData>;
  categories: Category[];
  categoryColorMap: Record<string, string>;
  categoryNameMap: Record<string, string>;
}

export function TransactionsPage({
  months,
  monthlyDataMap,
  categories,
  categoryColorMap,
  categoryNameMap,
}: TransactionsPageProps) {
  const getCategoryColor = (key: string) => categoryColorMap[key] || "#757575";
  const getCategoryName = (key: string) => categoryNameMap[key] || key;
  const { selectedMonth, setSelectedMonth } = useMonth();
  const [overrides, setOverrides] = useState<Record<string, string>>({});
  const pendingCount = Object.keys(overrides).length;

  if (months.length === 0) {
    return (
      <div className="text-center py-24 text-gray-500">אין נתוני תנועות.</div>
    );
  }

  const data = monthlyDataMap[selectedMonth];
  if (!data) return null;

  const transactions = data.transactions.map((tx) =>
    overrides[tx.id] ? { ...tx, category: overrides[tx.id] } : tx
  );

  const handleRecategorize = (txId: string, newCategory: string) => {
    const original = data.transactions.find((t) => t.id === txId);
    if (original && original.category === newCategory) {
      const next = { ...overrides };
      delete next[txId];
      setOverrides(next);
    } else {
      setOverrides((prev) => ({ ...prev, [txId]: newCategory }));
    }
  };

  const downloadChanges = () => {
    const changes = Object.entries(overrides).map(([txId, category]) => {
      const tx = data.transactions.find((t) => t.id === txId);
      return {
        txId,
        merchant: tx?.merchant || "",
        oldCategory: tx?.category || "",
        newCategory: category,
      };
    });

    const blob = new Blob([JSON.stringify(changes, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `category-changes-${selectedMonth}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <MonthSelector months={months} selected={selectedMonth} onChange={setSelectedMonth} />

      {pendingCount > 0 && (
        <div className="flex items-center justify-between bg-amber-500/10 border border-amber-500/20 rounded-2xl px-4 py-3">
          <span className="text-sm text-amber-300">
            {pendingCount} שינויי קטגוריה ממתינים.
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setOverrides({})}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-gray-400 hover:text-gray-200 hover:bg-gray-700/50 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              איפוס
            </button>
            <button
              onClick={downloadChanges}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              הורדת שינויים
            </button>
          </div>
        </div>
      )}

      <TransactionList
        transactions={transactions}
        categories={categories}
        getCategoryColor={getCategoryColor}
        getCategoryName={getCategoryName}
        onRecategorize={handleRecategorize}
      />
    </div>
  );
}
