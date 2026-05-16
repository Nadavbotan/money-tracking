"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { Search, Filter, ArrowUpDown, Pencil, X, Check } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/formatters";
import type { Transaction, Category } from "@/lib/types";

interface TransactionListProps {
  transactions: Transaction[];
  categories: Category[];
  getCategoryColor: (key: string) => string;
  getCategoryName: (key: string) => string;
  onRecategorize?: (txId: string, newCategory: string) => void;
}

type SortField = "date" | "amount";
type SortDir = "asc" | "desc";

function CategoryBadge({
  categoryKey,
  getCategoryColor,
  getCategoryName,
  onClick,
}: {
  categoryKey: string;
  getCategoryColor: (key: string) => string;
  getCategoryName: (key: string) => string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer hover:ring-1 hover:ring-gray-500 transition-all group"
      style={{
        backgroundColor: getCategoryColor(categoryKey) + "20",
        color: getCategoryColor(categoryKey),
      }}
    >
      {getCategoryName(categoryKey)}
      <Pencil className="w-3 h-3 opacity-0 group-hover:opacity-60 transition-opacity" />
    </button>
  );
}

function CategoryPicker({
  categories,
  current,
  getCategoryColor,
  onSelect,
  onClose,
}: {
  categories: Category[];
  current: string;
  getCategoryColor: (key: string) => string;
  onSelect: (key: string) => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute z-50 mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-xl py-1 max-h-64 overflow-y-auto min-w-[180px]"
    >
      {categories.map((cat) => (
        <button
          key={cat.key}
          onClick={() => onSelect(cat.key)}
          className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:bg-gray-700/50 transition-colors ${
            cat.key === current ? "bg-gray-700/30" : ""
          }`}
        >
          <div
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{ backgroundColor: getCategoryColor(cat.key) }}
          />
          <span className="text-gray-200">{cat.name}</span>
          {cat.key === current && <Check className="w-3.5 h-3.5 text-blue-400 ml-auto" />}
        </button>
      ))}
    </div>
  );
}

export function TransactionList({
  transactions,
  categories,
  getCategoryColor,
  getCategoryName,
  onRecategorize,
}: TransactionListProps) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [showFilters, setShowFilters] = useState(false);
  const [editingTxId, setEditingTxId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let result = [...transactions];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter((t) => t.merchant.toLowerCase().includes(q));
    }

    if (categoryFilter !== "all") {
      result = result.filter((t) => t.category === categoryFilter);
    }

    if (typeFilter !== "all") {
      result = result.filter((t) => t.type === typeFilter);
    }

    result.sort((a, b) => {
      const mul = sortDir === "asc" ? 1 : -1;
      if (sortField === "date") {
        return mul * (new Date(a.date).getTime() - new Date(b.date).getTime());
      }
      return mul * (a.amount - b.amount);
    });

    return result;
  }, [transactions, search, categoryFilter, typeFilter, sortField, sortDir]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  const usedCategories = useMemo(() => {
    const keys = new Set(transactions.map((t) => t.category));
    return categories.filter((c) => keys.has(c.key));
  }, [transactions, categories]);

  const handleRecategorize = (txId: string, newCategory: string) => {
    setEditingTxId(null);
    if (onRecategorize) {
      onRecategorize(txId, newCategory);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search merchants..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg pl-10 pr-4 py-2.5 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-colors"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm transition-colors ${
            showFilters
              ? "bg-blue-500/10 border-blue-500/30 text-blue-400"
              : "bg-gray-800/50 border-gray-700/50 text-gray-400 hover:text-gray-300"
          }`}
        >
          <Filter className="w-4 h-4" />
          <span className="hidden sm:inline">Filters</span>
        </button>
      </div>

      {showFilters && (
        <div className="flex flex-wrap gap-3 p-4 bg-gray-800/30 rounded-lg border border-gray-700/30">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-blue-500/50"
          >
            <option value="all">All categories</option>
            {usedCategories.map((c) => (
              <option key={c.key} value={c.key}>
                {c.name}
              </option>
            ))}
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-blue-500/50"
          >
            <option value="all">All types</option>
            <option value="expense">Expenses</option>
            <option value="income">Income</option>
          </select>
        </div>
      )}

      <div className="text-xs text-gray-500">
        {filtered.length} transaction{filtered.length !== 1 ? "s" : ""}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs text-gray-500 border-b border-gray-800">
              <th
                className="pb-3 pr-4 cursor-pointer hover:text-gray-300 transition-colors"
                onClick={() => toggleSort("date")}
              >
                <span className="flex items-center gap-1">
                  Date <ArrowUpDown className="w-3 h-3" />
                </span>
              </th>
              <th className="pb-3 pr-4">Merchant</th>
              <th className="pb-3 pr-4">Category</th>
              <th
                className="pb-3 text-right cursor-pointer hover:text-gray-300 transition-colors"
                onClick={() => toggleSort("amount")}
              >
                <span className="flex items-center justify-end gap-1">
                  Amount <ArrowUpDown className="w-3 h-3" />
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((tx) => (
              <tr
                key={tx.id}
                className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors"
              >
                <td className="py-3 pr-4 text-sm text-gray-400">{formatDate(tx.date)}</td>
                <td className="py-3 pr-4 text-sm text-gray-200">{tx.merchant}</td>
                <td className="py-3 pr-4 relative">
                  <CategoryBadge
                    categoryKey={tx.category}
                    getCategoryColor={getCategoryColor}
                    getCategoryName={getCategoryName}
                    onClick={() => setEditingTxId(editingTxId === tx.id ? null : tx.id)}
                  />
                  {editingTxId === tx.id && (
                    <CategoryPicker
                      categories={categories}
                      current={tx.category}
                      getCategoryColor={getCategoryColor}
                      onSelect={(cat) => handleRecategorize(tx.id, cat)}
                      onClose={() => setEditingTxId(null)}
                    />
                  )}
                </td>
                <td
                  className={`py-3 text-sm text-right font-medium ${
                    tx.type === "income" ? "text-emerald-400" : "text-gray-200"
                  }`}
                >
                  {tx.type === "income" ? "+" : ""}
                  {formatCurrency(tx.charged_amount || tx.amount, tx.currency)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-2">
        {filtered.map((tx) => (
          <div
            key={tx.id}
            className="bg-gray-800/30 border border-gray-700/30 rounded-lg p-4"
          >
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-gray-200 truncate">{tx.merchant}</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-500">{formatDate(tx.date)}</span>
                  <div className="relative">
                    <CategoryBadge
                      categoryKey={tx.category}
                      getCategoryColor={getCategoryColor}
                      getCategoryName={getCategoryName}
                      onClick={() => setEditingTxId(editingTxId === tx.id ? null : tx.id)}
                    />
                    {editingTxId === tx.id && (
                      <CategoryPicker
                        categories={categories}
                        current={tx.category}
                        getCategoryColor={getCategoryColor}
                        onSelect={(cat) => handleRecategorize(tx.id, cat)}
                        onClose={() => setEditingTxId(null)}
                      />
                    )}
                  </div>
                </div>
              </div>
              <div
                className={`text-sm font-semibold ml-3 ${
                  tx.type === "income" ? "text-emerald-400" : "text-gray-200"
                }`}
              >
                {tx.type === "income" ? "+" : ""}
                {formatCurrency(tx.charged_amount || tx.amount, tx.currency)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-500">No transactions found</div>
      )}
    </div>
  );
}
