"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import { formatCurrency, formatMonthShort } from "@/lib/formatters";

interface CategoryBarData {
  name: string;
  amount: number;
  color: string;
}

export function CategoryBreakdownChart({
  data,
}: {
  data: CategoryBarData[];
}) {
  if (data.length === 0) return null;

  return (
    <ResponsiveContainer width="100%" height={Math.max(300, data.length * 44)}>
      <BarChart data={data} layout="vertical" margin={{ left: 8, right: 24, top: 8, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" horizontal={false} />
        <XAxis
          type="number"
          tickFormatter={(v) => formatCurrency(v)}
          stroke="#6b7280"
          fontSize={12}
        />
        <YAxis
          type="category"
          dataKey="name"
          width={130}
          stroke="#6b7280"
          fontSize={13}
          tick={{ fill: "#d1d5db" }}
        />
        <Tooltip
          formatter={(value) => [formatCurrency(Number(value)), "Spent"]}
          contentStyle={{
            backgroundColor: "#111827",
            border: "1px solid #374151",
            borderRadius: "8px",
            color: "#f9fafb",
          }}
        />
        <Bar dataKey="amount" radius={[0, 6, 6, 0]} barSize={28}>
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

interface SpendVsIncomeData {
  month: string;
  expenses: number;
  income: number;
  net: number;
}

export function SpendVsIncomeChart({
  data,
}: {
  data: SpendVsIncomeData[];
}) {
  if (data.length === 0) return null;

  return (
    <ResponsiveContainer width="100%" height={320}>
      <AreaChart data={data} margin={{ left: 8, right: 24, top: 8, bottom: 8 }}>
        <defs>
          <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
        <XAxis dataKey="month" stroke="#6b7280" fontSize={12} tick={{ fill: "#9ca3af" }} />
        <YAxis
          tickFormatter={(v) => formatCurrency(v)}
          stroke="#6b7280"
          fontSize={12}
          tick={{ fill: "#9ca3af" }}
        />
        <Tooltip
          formatter={(value, name) => [
            formatCurrency(Number(value)),
            name === "income" ? "Income" : name === "expenses" ? "Expenses" : "Net",
          ]}
          contentStyle={{
            backgroundColor: "#111827",
            border: "1px solid #374151",
            borderRadius: "8px",
            color: "#f9fafb",
          }}
          labelStyle={{ color: "#9ca3af" }}
        />
        <Legend
          wrapperStyle={{ color: "#d1d5db", fontSize: 13 }}
          formatter={(value) =>
            value === "income" ? "Income" : value === "expenses" ? "Expenses" : "Net"
          }
        />
        <Area
          type="monotone"
          dataKey="income"
          stroke="#10b981"
          strokeWidth={2.5}
          fill="url(#incomeGrad)"
        />
        <Area
          type="monotone"
          dataKey="expenses"
          stroke="#ef4444"
          strokeWidth={2.5}
          fill="url(#expenseGrad)"
        />
        <Line
          type="monotone"
          dataKey="net"
          stroke="#f59e0b"
          strokeWidth={2}
          strokeDasharray="6 3"
          dot={{ r: 4, fill: "#f59e0b" }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function CategoryDonutChart({
  data,
  total,
}: {
  data: CategoryBarData[];
  total: number;
}) {
  if (data.length === 0) return null;

  const top = data.slice(0, 8);
  const otherAmount = data.slice(8).reduce((s, d) => s + d.amount, 0);
  const chartData =
    otherAmount > 0 ? [...top, { name: "Other", amount: otherAmount, color: "#757575" }] : top;

  return (
    <div>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="amount"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={110}
            paddingAngle={2}
            strokeWidth={0}
          >
            {chartData.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name) => [
              `${formatCurrency(Number(value))} (${((Number(value) / total) * 100).toFixed(1)}%)`,
              name,
            ]}
            contentStyle={{
              backgroundColor: "#111827",
              border: "1px solid #374151",
              borderRadius: "8px",
              color: "#f9fafb",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3 px-2">
        {chartData.map((entry) => (
          <div key={entry.name} className="flex items-center gap-2 min-w-0">
            <div
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs text-gray-400 truncate">{entry.name}</span>
            <span className="text-xs text-gray-300 ml-auto shrink-0">
              {((entry.amount / total) * 100).toFixed(0)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface ComparisonBarData {
  category: string;
  current: number;
  previous: number;
  color: string;
}

export function MonthComparisonChart({
  data,
  currentLabel,
  previousLabel,
}: {
  data: ComparisonBarData[];
  currentLabel: string;
  previousLabel: string;
}) {
  if (data.length === 0) return null;

  return (
    <ResponsiveContainer width="100%" height={Math.max(300, data.length * 50)}>
      <BarChart data={data} layout="vertical" margin={{ left: 8, right: 24, top: 8, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" horizontal={false} />
        <XAxis
          type="number"
          tickFormatter={(v) => formatCurrency(v)}
          stroke="#6b7280"
          fontSize={12}
        />
        <YAxis
          type="category"
          dataKey="category"
          width={130}
          stroke="#6b7280"
          fontSize={13}
          tick={{ fill: "#d1d5db" }}
        />
        <Tooltip
          formatter={(value) => [formatCurrency(Number(value))]}
          contentStyle={{
            backgroundColor: "#111827",
            border: "1px solid #374151",
            borderRadius: "8px",
            color: "#f9fafb",
          }}
        />
        <Legend wrapperStyle={{ color: "#d1d5db", fontSize: 13 }} />
        <Bar name={currentLabel} dataKey="current" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={16} />
        <Bar name={previousLabel} dataKey="previous" fill="#6b7280" radius={[0, 4, 4, 0]} barSize={16} />
      </BarChart>
    </ResponsiveContainer>
  );
}
