"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";

interface MonthContextValue {
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
}

const MonthContext = createContext<MonthContextValue | null>(null);

export function MonthProvider({
  children,
  months,
}: {
  children: React.ReactNode;
  months: string[];
}) {
  const [selectedMonth, setSelectedMonthRaw] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("selectedMonth");
      if (stored && months.includes(stored)) return stored;
    }
    return months[0] || "";
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("selectedMonth");
      if (stored && months.includes(stored)) {
        setSelectedMonthRaw(stored);
      }
    }
  }, [months]);

  const setSelectedMonth = useCallback((month: string) => {
    setSelectedMonthRaw(month);
    if (typeof window !== "undefined") {
      localStorage.setItem("selectedMonth", month);
    }
  }, []);

  return (
    <MonthContext.Provider value={{ selectedMonth, setSelectedMonth }}>
      {children}
    </MonthContext.Provider>
  );
}

export function useMonth(): MonthContextValue {
  const ctx = useContext(MonthContext);
  if (!ctx) {
    throw new Error("useMonth must be used within a MonthProvider");
  }
  return ctx;
}
