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
    categoryNameMap[cat.key] = cat.nameHe;
  }

  return (
    <main className="max-w-lg mx-auto px-4 pt-4 pb-24 lg:max-w-7xl lg:px-6">
      <h1 className="text-xl font-bold text-gray-100 text-center mb-4">סקירה</h1>
      <OverviewDashboard
        months={months}
        monthlyDataMap={monthlyDataMap}
        summaries={summaries}
        categories={[...categories.expenses, ...categories.income]}
        categoryColorMap={categoryColorMap}
        categoryNameMap={categoryNameMap}
      />
      <Navigation />
    </main>
  );
}
