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
  Legend,
  LabelList,
} from "recharts";
import { formatCurrency, formatCurrencyWithSign } from "@/lib/formatters";

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
    <div dir="ltr">
      <ResponsiveContainer width="100%" height={Math.max(280, data.length * 44)}>
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
            width={100}
            stroke="#6b7280"
            fontSize={12}
            tick={{ fill: "#d1d5db" }}
          />
          <Tooltip
            formatter={(value) => [formatCurrency(Number(value)), "הוצאה"]}
            contentStyle={{
              backgroundColor: "#111827",
              border: "1px solid #374151",
              borderRadius: "12px",
              color: "#f9fafb",
            }}
          />
          <Bar dataKey="amount" radius={[0, 6, 6, 0]} barSize={26}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

interface NetBarData {
  month: string;
  net: number;
  fill: string;
}

export function NetBarChart({
  data,
}: {
  data: { month: string; expenses: number; income: number; net: number }[];
}) {
  if (data.length === 0) return null;

  const barData: NetBarData[] = data.map((d) => ({
    month: d.month,
    net: d.net,
    fill: d.net >= 0 ? "#10b981" : "#ef4444",
  }));

  return (
    <div dir="ltr">
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={barData} margin={{ left: 8, right: 8, top: 24, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
          <XAxis
            dataKey="month"
            stroke="#6b7280"
            fontSize={12}
            tick={{ fill: "#9ca3af" }}
          />
          <YAxis
            tickFormatter={(v) => formatCurrency(v)}
            stroke="#6b7280"
            fontSize={11}
            tick={{ fill: "#9ca3af" }}
          />
          <Tooltip
            formatter={(value) => [formatCurrencyWithSign(Number(value)), "נטו"]}
            contentStyle={{
              backgroundColor: "#111827",
              border: "1px solid #374151",
              borderRadius: "12px",
              color: "#f9fafb",
            }}
            labelStyle={{ color: "#9ca3af" }}
          />
          <Bar dataKey="net" radius={[6, 6, 0, 0]} barSize={36}>
            {barData.map((entry, i) => (
              <Cell key={i} fill={entry.fill} />
            ))}
            <LabelList
              dataKey="net"
              position="top"
              formatter={(v: unknown) => formatCurrencyWithSign(Number(v))}
              style={{ fontSize: 11, fill: "#d1d5db", fontWeight: 600 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
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

  const top = data.slice(0, 6);
  const otherAmount = data.slice(6).reduce((s, d) => s + d.amount, 0);
  const chartData =
    otherAmount > 0 ? [...top, { name: "אחר", amount: otherAmount, color: "#757575" }] : top;

  return (
    <div>
      <div dir="ltr">
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="amount"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={95}
              paddingAngle={2}
              strokeWidth={0}
            >
              {chartData.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [
                `${formatCurrency(Number(value))} (${((Number(value) / total) * 100).toFixed(0)}%)`,
                name,
              ]}
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
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2 px-1">
        {chartData.map((entry) => (
          <div key={entry.name} className="flex items-center gap-2 min-w-0">
            <div
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs text-gray-400 truncate">{entry.name}</span>
            <span className="text-xs text-gray-300 mr-auto shrink-0">
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
    <div dir="ltr">
      <ResponsiveContainer width="100%" height={Math.max(280, data.length * 50)}>
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
            width={100}
            stroke="#6b7280"
            fontSize={12}
            tick={{ fill: "#d1d5db" }}
          />
          <Tooltip
            formatter={(value) => [formatCurrency(Number(value))]}
            contentStyle={{
              backgroundColor: "#111827",
              border: "1px solid #374151",
              borderRadius: "12px",
              color: "#f9fafb",
            }}
          />
          <Legend wrapperStyle={{ color: "#d1d5db", fontSize: 13 }} />
          <Bar name={currentLabel} dataKey="current" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={14} />
          <Bar name={previousLabel} dataKey="previous" fill="#4b5563" radius={[0, 4, 4, 0]} barSize={14} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
