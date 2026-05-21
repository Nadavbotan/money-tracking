export interface Transaction {
  id: string;
  date: string;
  merchant: string;
  amount: number;
  charged_amount: number;
  currency: string;
  category: string;
  card: string;
  source: "local" | "abroad";
  type: "expense" | "income";
  transaction_type: "regular" | "standing_order";
  reference?: string;
}

export interface Category {
  key: string;
  name: string;
  nameHe: string;
  icon: string;
  color: string;
}

export interface CategoryConfig {
  expenses: Category[];
  income: Category[];
}

export interface Card {
  id: string;
  label: string;
  last4: string;
  bank: string;
}

export interface MonthlyData {
  month: string;
  transactions: Transaction[];
  totalExpenses: number;
  totalIncome: number;
  net: number;
  byCategory: Record<string, number>;
}

export interface MonthlySummary {
  month: string;
  totalExpenses: number;
  totalIncome: number;
  net: number;
}

export interface StockHolding {
  ticker: string;
  name: string;
  shares: number;
  avgCostILS: number;
  currentPriceILS: number;
  currency: "ILS" | "USD";
  value: number;
  gainLoss: number;
  gainLossPercent: number;
  lastUpdated: string;
}

export interface SavingsAccount {
  name: string;
  amount: number;
}

export interface RealEstateAsset {
  name: string;
  estimatedValue: number;
  mortgage: number;
  equity: number;
}

export interface NetWorthData {
  lastUpdated: string;
  stocks: StockHolding[];
  savings: SavingsAccount[];
  realEstate: RealEstateAsset[];
  totalStocks: number;
  totalSavings: number;
  totalRealEstateEquity: number;
  totalNetWorth: number;
}
