import { GoalsPage } from "@/components/GoalsPage";
import { Navigation } from "@/components/Navigation";
import { readFileSync } from "fs";
import { join } from "path";

function getGoalsData() {
  const filePath = join(process.cwd(), "public", "data", "goals.json");
  const raw = readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}

export default function Goals() {
  let goalsData;
  try {
    goalsData = getGoalsData();
  } catch {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6" dir="rtl">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-100">Money Tracker</h1>
          <Navigation />
        </div>
        <div className="bg-red-900/20 border border-red-700/50 rounded-2xl p-6 text-center">
          <p className="text-red-400">לא ניתן לטעון את נתוני היעדים</p>
          <p className="text-gray-500 text-sm mt-1">בדוק שהקובץ public/data/goals.json תקין</p>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-100">Money Tracker</h1>
        <Navigation />
      </div>
      <GoalsPage data={goalsData} />
    </main>
  );
}
