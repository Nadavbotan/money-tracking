"use client";

import { formatCurrency } from "@/lib/formatters";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { TrendingUp, TrendingDown, Landmark, PiggyBank, Home, BarChart3, Building2 } from "lucide-react";
import type { NetWorthData } from "@/lib/types";

interface NetWorthPageProps {
  data: NetWorthData;
}

export function NetWorthPage({ data }: NetWorthPageProps) {
  if (!data.lastUpdated) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mb-4">
          <BarChart3 className="w-8 h-8 text-gray-500" />
        </div>
        <h2 className="text-xl font-semibold text-gray-200 mb-2">אין נתוני שווי נקי</h2>
        <p className="text-gray-500 max-w-md text-sm">
          יש להוסיף קובץ net-worth.json עם נתוני חסכונות, השקעות ונדל״ן.
        </p>
      </div>
    );
  }

  const pieData = [
    { name: "מניות", value: data.totalStocks, color: "#3b82f6" },
    { name: "RSU", value: data.totalRSU || 0, color: "#a78bfa" },
    { name: "חסכונות", value: data.totalSavings, color: "#10b981" },
    { name: "נדל״ן (הון עצמי)", value: data.totalRealEstateEquity, color: "#8b5cf6" },
  ].filter((d) => d.value > 0);

  return (
    <div className="space-y-4">
      {/* Total net worth */}
      <div className="bg-gradient-to-bl from-blue-950/40 to-gray-900 border border-blue-800/30 rounded-2xl p-5 text-center">
        <div className="text-sm text-gray-400 mb-1">שווי נקי כולל</div>
        <div className="text-4xl font-bold text-blue-400">{formatCurrency(data.totalNetWorth)}</div>
        <div className="text-xs text-gray-500 mt-2">עדכון אחרון: {data.lastUpdated}</div>
      </div>

      {/* Breakdown donut */}
      {pieData.length > 1 && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
          <h3 className="text-sm font-semibold text-gray-300 mb-3">התפלגות נכסים</h3>
          <div dir="ltr">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  strokeWidth={0}
                >
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [formatCurrency(Number(value))]}
                  contentStyle={{
                    backgroundColor: "#111827",
                    border: "1px solid #374151",
                    borderRadius: "12px",
                    color: "#f9fafb",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-2">
            {pieData.map((d) => (
              <div key={d.name} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                <span className="text-xs text-gray-400">{d.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summary cards */}
      <div className={`grid gap-3 ${data.totalRSU ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-3"}`}>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-3 text-center">
          <Landmark className="w-5 h-5 text-blue-400 mx-auto mb-1.5" />
          <div className="text-lg font-bold text-blue-400">{formatCurrency(data.totalStocks)}</div>
          <div className="text-[10px] text-gray-500 mt-0.5">מניות</div>
        </div>
        {data.totalRSU > 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-3 text-center">
            <Building2 className="w-5 h-5 text-violet-400 mx-auto mb-1.5" />
            <div className="text-lg font-bold text-violet-400">{formatCurrency(data.totalRSU)}</div>
            <div className="text-[10px] text-gray-500 mt-0.5">RSU</div>
          </div>
        )}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-3 text-center">
          <PiggyBank className="w-5 h-5 text-emerald-400 mx-auto mb-1.5" />
          <div className="text-lg font-bold text-emerald-400">{formatCurrency(data.totalSavings)}</div>
          <div className="text-[10px] text-gray-500 mt-0.5">חסכונות</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-3 text-center">
          <Home className="w-5 h-5 text-purple-400 mx-auto mb-1.5" />
          <div className="text-lg font-bold text-purple-400">{formatCurrency(data.totalRealEstateEquity)}</div>
          <div className="text-[10px] text-gray-500 mt-0.5">נדל״ן</div>
        </div>
      </div>

      {/* Stocks table */}
      {data.stocks.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
          <h3 className="text-sm font-semibold text-gray-300 mb-3">מניות והשקעות</h3>
          <div className="space-y-3">
            {data.stocks.map((stock) => (
              <div key={stock.ticker} className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-200">{stock.ticker}</span>
                    <span className="text-xs text-gray-500">{stock.name}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {stock.shares} יחידות - עלות ממוצעת {formatCurrency(stock.avgCostILS)}
                  </div>
                </div>
                <div className="text-end shrink-0 ms-3">
                  <div className="text-sm font-bold text-gray-200">{formatCurrency(stock.value)}</div>
                  <div className={`text-xs font-medium flex items-center justify-end gap-0.5 ${
                    stock.gainLoss >= 0 ? "text-emerald-400" : "text-red-400"
                  }`}>
                    {stock.gainLoss >= 0
                      ? <TrendingUp className="w-3 h-3" />
                      : <TrendingDown className="w-3 h-3" />
                    }
                    {stock.gainLoss >= 0 ? "+" : ""}{stock.gainLossPercent.toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* RSU */}
      {data.rsu && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
          <h3 className="text-sm font-semibold text-gray-300 mb-3">RSU - {data.rsu.company}</h3>
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-gray-200">MNDY</span>
                <span className="text-xs text-gray-500">{data.rsu.company}</span>
              </div>
              <div className="text-xs text-gray-500 mt-0.5">
                {data.rsu.units} יחידות x ${data.rsu.sharePriceUSD}
              </div>
            </div>
            <div className="text-end shrink-0 ms-3">
              <div className="text-sm font-bold text-gray-200">{formatCurrency(data.rsu.valueILS)}</div>
              <div className="text-xs text-gray-500">
                ${data.rsu.valueUSD.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Savings */}
      {data.savings.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
          <h3 className="text-sm font-semibold text-gray-300 mb-3">חסכונות</h3>
          <div className="space-y-2.5">
            {data.savings.map((account, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-sm text-gray-300">{account.name}</span>
                <span className="text-sm font-bold text-gray-200">{formatCurrency(account.amount)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Real estate */}
      {data.realEstate.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
          <h3 className="text-sm font-semibold text-gray-300 mb-3">נדל״ן</h3>
          <div className="space-y-4">
            {data.realEstate.map((asset, i) => (
              <div key={i}>
                <div className="text-sm font-medium text-gray-200 mb-2">{asset.name}</div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-gray-800 rounded-xl p-2.5 text-center">
                    <div className="text-xs text-gray-500 mb-1">שווי מוערך</div>
                    <div className="text-sm font-bold text-gray-200">{formatCurrency(asset.estimatedValue)}</div>
                  </div>
                  <div className="bg-gray-800 rounded-xl p-2.5 text-center">
                    <div className="text-xs text-gray-500 mb-1">משכנתא</div>
                    <div className="text-sm font-bold text-red-400">{formatCurrency(asset.mortgage)}</div>
                  </div>
                  <div className="bg-gray-800 rounded-xl p-2.5 text-center">
                    <div className="text-xs text-gray-500 mb-1">הון עצמי</div>
                    <div className="text-sm font-bold text-emerald-400">{formatCurrency(asset.equity)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
