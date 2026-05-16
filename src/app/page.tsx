import { getAvailableMonths, getMonthlyData, getAllMonthlySummaries, getCategories } from "@/lib/data";
import { OverviewDashboard } from "@/components/OverviewDashboard";
import { Navigation } from "@/components/Navigation";
import type { MonthlyData } from "@/lib/types";

export default function Home() {
  const months = getAvailableMonths();
  const summaries = getAllMonthlySummaries();
  const categories = getCategories();

  const monthlyDataMap: Record<string, MonthlyData> = {};
  for (const month of months) {
    monthlyDataMap[month] = getMonthlyData(month);
  }

  const categoryColorMap: Record<string, string> = {};
  const categoryNameMap: Record<string, string> = {};
  for (const cat of [...categories.expenses, ...categories.income]) {
    categoryColorMap[cat.key] = cat.color;
    categoryNameMap[cat.key] = cat.name;
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-100">Money Tracker</h1>
        <Navigation />
      </div>
      <OverviewDashboard
        months={months}
        monthlyDataMap={monthlyDataMap}
        summaries={summaries}
        categories={[...categories.expenses, ...categories.income]}
        categoryColorMap={categoryColorMap}
        categoryNameMap={categoryNameMap}
      />
    </main>
  );
}
