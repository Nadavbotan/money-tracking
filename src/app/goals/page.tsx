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
  const goalsData = getGoalsData();
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-100">Money Tracker</h1>
        <Navigation />
      </div>
      <GoalsPage data={goalsData} />
    </main>
  );
}
