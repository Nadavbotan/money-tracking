"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatMonth } from "@/lib/formatters";

interface MonthSelectorProps {
  months: string[];
  selected: string;
  onChange: (month: string) => void;
}

export function MonthSelector({ months, selected, onChange }: MonthSelectorProps) {
  const currentIdx = months.indexOf(selected);
  const hasPrev = currentIdx < months.length - 1;
  const hasNext = currentIdx > 0;

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => hasPrev && onChange(months[currentIdx + 1])}
        disabled={!hasPrev}
        className="p-2 rounded-lg hover:bg-gray-700/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft className="w-5 h-5 text-gray-300" />
      </button>
      <span className="text-lg font-semibold text-gray-100 min-w-[160px] text-center">
        {formatMonth(selected)}
      </span>
      <button
        onClick={() => hasNext && onChange(months[currentIdx - 1])}
        disabled={!hasNext}
        className="p-2 rounded-lg hover:bg-gray-700/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight className="w-5 h-5 text-gray-300" />
      </button>
    </div>
  );
}
