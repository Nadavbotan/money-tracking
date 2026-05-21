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
      <main className="max-w-lg mx-auto px-4 pt-4 pb-24 lg:max-w-7xl lg:px-6">
        <h1 className="text-xl font-bold text-gray-100 text-center mb-4">יעדים</h1>
        <div className="bg-red-900/20 border border-red-700/50 rounded-2xl p-6 text-center">
          <p className="text-red-400">לא ניתן לטעון את נתוני היעדים</p>
          <p className="text-gray-500 text-sm mt-1">בדוק שהקובץ public/data/goals.json תקין</p>
        </div>
        <Navigation />
      </main>
    );
  }

  return (
    <main className="max-w-lg mx-auto px-4 pt-4 pb-24 lg:max-w-7xl lg:px-6">
      <h1 className="text-xl font-bold text-gray-100 text-center mb-4">יעדים</h1>
      <GoalsPage data={goalsData} />
      <Navigation />
    </main>
  );
}
