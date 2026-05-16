const CURRENCY_SYMBOLS: Record<string, string> = {
  ILS: "\u20AA",
  USD: "$",
  EUR: "\u20AC",
  GBP: "\u00A3",
};

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const SHORT_MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function formatCurrency(amount: number, currency = "ILS"): string {
  const symbol = CURRENCY_SYMBOLS[currency] ?? currency;
  const formatted = Math.abs(amount).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const prefix = amount < 0 ? "-" : "";
  return `${prefix}${formatted} ${symbol}`;
}

export function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const shortMonth = SHORT_MONTH_NAMES[month - 1] ?? "???";
  return `${shortMonth} ${day}, ${year}`;
}

export function formatMonth(monthStr: string): string {
  const [year, month] = monthStr.split("-").map(Number);
  const name = MONTH_NAMES[month - 1] ?? "???";
  return `${name} ${year}`;
}

export function formatMonthShort(monthStr: string): string {
  const [, month] = monthStr.split("-").map(Number);
  return SHORT_MONTH_NAMES[month - 1] ?? "???";
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}
