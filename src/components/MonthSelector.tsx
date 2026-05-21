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
  const hasNewer = currentIdx > 0;
  const hasOlder = currentIdx < months.length - 1;

  return (
    <div className="flex items-center justify-center gap-3">
      <button
        onClick={() => hasOlder && onChange(months[currentIdx + 1])}
        disabled={!hasOlder}
        className="p-2 rounded-xl hover:bg-gray-800 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight className="w-5 h-5 text-gray-300" />
      </button>
      <span className="text-lg font-bold text-gray-100 min-w-[140px] text-center">
        {formatMonth(selected)}
      </span>
      <button
        onClick={() => hasNewer && onChange(months[currentIdx - 1])}
        disabled={!hasNewer}
        className="p-2 rounded-xl hover:bg-gray-800 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft className="w-5 h-5 text-gray-300" />
      </button>
    </div>
  );
}
