import fs from "fs";
import path from "path";
import type {
  Transaction,
  CategoryConfig,
  Category,
  Card,
  MonthlyData,
  MonthlySummary,
} from "./types";

const DATA_DIR = path.join(process.cwd(), "public", "data");

function readJSON<T>(filePath: string, fallback: T): T {
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

let _categories: CategoryConfig | null = null;

export function getCategories(): CategoryConfig {
  if (!_categories) {
    _categories = readJSON<CategoryConfig>(
      path.join(DATA_DIR, "categories.json"),
      { expenses: [], income: [] }
    );
  }
  return _categories;
}

export function getCards(): Card[] {
  return readJSON<Card[]>(path.join(DATA_DIR, "cards.json"), []);
}

export function getTransactions(month?: string): Transaction[] {
  const txDir = path.join(DATA_DIR, "transactions");
  const incomeDir = path.join(DATA_DIR, "income");

  let months: string[];

  if (month) {
    months = [month];
  } else {
    months = getAvailableMonths();
  }

  const transactions: Transaction[] = [];

  for (const m of months) {
    const txFile = path.join(txDir, `${m}.json`);
    const expenseTxs = readJSON<Transaction[]>(txFile, []);
    transactions.push(...expenseTxs);

    const incomeFile = path.join(incomeDir, `${m}.json`);
    const incomeTxs = readJSON<Transaction[]>(incomeFile, []);
    transactions.push(...incomeTxs);
  }

  transactions.sort((a, b) => b.date.localeCompare(a.date));
  return transactions;
}

export function getAvailableMonths(): string[] {
  const txDir = path.join(DATA_DIR, "transactions");
  try {
    const files = fs.readdirSync(txDir);
    return files
      .filter((f) => f.endsWith(".json"))
      .map((f) => f.replace(".json", ""))
      .sort()
      .reverse();
  } catch {
    return [];
  }
}

export function getMonthlyData(month: string): MonthlyData {
  const transactions = getTransactions(month);

  let totalExpenses = 0;
  let totalIncome = 0;
  const byCategory: Record<string, number> = {};

  for (const tx of transactions) {
    const amt = Math.abs(tx.charged_amount);
    if (tx.type === "income") {
      totalIncome += amt;
    } else {
      totalExpenses += amt;
      byCategory[tx.category] = (byCategory[tx.category] || 0) + amt;
    }
  }

  return {
    month,
    transactions,
    totalExpenses: Math.round(totalExpenses * 100) / 100,
    totalIncome: Math.round(totalIncome * 100) / 100,
    net: Math.round((totalIncome - totalExpenses) * 100) / 100,
    byCategory,
  };
}

export function getAllMonthlySummaries(): MonthlySummary[] {
  const months = getAvailableMonths();
  return months.map((month) => {
    const data = getMonthlyData(month);
    return {
      month: data.month,
      totalExpenses: data.totalExpenses,
      totalIncome: data.totalIncome,
      net: data.net,
    };
  });
}

export function getCategoryColor(categoryKey: string): string {
  const config = getCategories();
  const all: Category[] = [...config.expenses, ...config.income];
  const match = all.find((c) => c.key === categoryKey);
  return match?.color ?? "#757575";
}

export function getCategoryName(categoryKey: string): string {
  const config = getCategories();
  const all: Category[] = [...config.expenses, ...config.income];
  const match = all.find((c) => c.key === categoryKey);
  return match?.name ?? categoryKey;
}
