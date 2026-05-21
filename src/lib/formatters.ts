const MONTH_NAMES_HE = [
  "ינואר",
  "פברואר",
  "מרץ",
  "אפריל",
  "מאי",
  "יוני",
  "יולי",
  "אוגוסט",
  "ספטמבר",
  "אוקטובר",
  "נובמבר",
  "דצמבר",
];

const SHORT_MONTH_NAMES_HE = [
  "ינו׳",
  "פבר׳",
  "מרץ",
  "אפר׳",
  "מאי",
  "יונ׳",
  "יול׳",
  "אוג׳",
  "ספט׳",
  "אוק׳",
  "נוב׳",
  "דצמ׳",
];

export function formatCurrency(amount: number, currency = "ILS"): string {
  const abs = Math.abs(amount);
  const formatted = abs.toLocaleString("he-IL", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  const prefix = amount < 0 ? "-" : "";
  if (currency === "ILS") return `${prefix}₪${formatted}`;
  if (currency === "USD") return `${prefix}$${formatted}`;
  if (currency === "EUR") return `${prefix}€${formatted}`;
  return `${prefix}${formatted} ${currency}`;
}

export function formatCurrencyWithSign(amount: number): string {
  const abs = Math.abs(amount);
  const formatted = abs.toLocaleString("he-IL", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  if (amount >= 0) return `+₪${formatted}`;
  return `-₪${formatted}`;
}

export function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const monthName = MONTH_NAMES_HE[month - 1] ?? "???";
  return `${day} ב${monthName} ${year}`;
}

export function formatDateShort(dateStr: string): string {
  const [, month, day] = dateStr.split("-").map(Number);
  const monthName = SHORT_MONTH_NAMES_HE[month - 1] ?? "???";
  return `${day} ${monthName}`;
}

export function formatMonth(monthStr: string): string {
  const [year, month] = monthStr.split("-").map(Number);
  const name = MONTH_NAMES_HE[month - 1] ?? "???";
  return `${name} ${year}`;
}

export function formatMonthShort(monthStr: string): string {
  const [, month] = monthStr.split("-").map(Number);
  return SHORT_MONTH_NAMES_HE[month - 1] ?? "???";
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}
