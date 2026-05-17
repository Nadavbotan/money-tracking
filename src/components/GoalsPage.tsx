"use client";

import { Target, TrendingUp, Plane, Baby, Rocket, CheckCircle2, Clock } from "lucide-react";

interface GoalSource {
  name: string;
  monthly: number;
  type: "auto" | "manual";
}

interface FinancialGoal {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  unit: string;
  icon: string;
  color: string;
  sources: GoalSource[];
  startBalance?: number;
  note?: string;
}

interface Aspiration {
  id: string;
  title: string;
  items: string[];
}

interface GoalsData {
  financialGoals: FinancialGoal[];
  aspirations: Aspiration[];
  lastUpdated: string;
}

const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  TrendingUp,
  Plane,
  Baby,
  Target,
  Rocket,
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("he-IL", {
    style: "currency",
    currency: "ILS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function ProgressRing({ percentage, color, size = 80 }: { percentage: number; color: string; size?: number }) {
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(percentage, 100) / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-gray-700/50"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-bold text-gray-100">{Math.round(percentage)}%</span>
      </div>
    </div>
  );
}

function GoalCard({ goal }: { goal: FinancialGoal }) {
  const Icon = iconMap[goal.icon] || Target;
  const percentage = (goal.current / goal.target) * 100;
  const remaining = goal.target - goal.current;

  return (
    <div className="bg-gray-800/60 backdrop-blur border border-gray-700/50 rounded-2xl p-6 hover:border-gray-600/50 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${goal.color}20` }}
          >
            <Icon className="w-5 h-5" style={{ color: goal.color }} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-100">{goal.title}</h3>
            <p className="text-sm text-gray-400">{goal.description}</p>
          </div>
        </div>
        <ProgressRing percentage={percentage} color={goal.color} />
      </div>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="flex justify-between text-sm mb-1.5">
          <span className="text-gray-400">התקדמות</span>
          <span className="font-medium text-gray-200">
            {formatCurrency(goal.current)} / {formatCurrency(goal.target)}
          </span>
        </div>
        <div className="w-full h-2.5 bg-gray-700/50 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000 ease-out"
            style={{
              width: `${Math.min(percentage, 100)}%`,
              backgroundColor: goal.color,
              boxShadow: `0 0 8px ${goal.color}40`,
            }}
          />
        </div>
      </div>

      {/* Remaining */}
      <div className="flex items-center justify-between text-sm mb-3">
        <span className="text-gray-500">נשאר</span>
        <span className="font-medium" style={{ color: goal.color }}>
          {formatCurrency(remaining)}
        </span>
      </div>

      {/* Sources */}
      {goal.sources.length > 0 && (
        <div className="border-t border-gray-700/50 pt-3 mt-3">
          <p className="text-xs text-gray-500 mb-2 font-medium">מקורות הכנסה ליעד:</p>
          <div className="space-y-1.5">
            {goal.sources.map((source, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  {source.type === "auto" ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                  ) : (
                    <Clock className="w-3.5 h-3.5 text-gray-500" />
                  )}
                  <span className="text-gray-300">{source.name}</span>
                </div>
                {source.monthly > 0 && (
                  <span className="text-gray-400 text-xs">{formatCurrency(source.monthly)}/חודש</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Note */}
      {goal.note && (
        <div className="mt-3 pt-3 border-t border-gray-700/30">
          <p className="text-xs text-gray-500 italic">💡 {goal.note}</p>
        </div>
      )}
    </div>
  );
}

function SummaryCard({ goals }: { goals: FinancialGoal[] }) {
  const totalTarget = goals.reduce((sum, g) => sum + g.target, 0);
  const totalCurrent = goals.reduce((sum, g) => sum + g.current, 0);
  const totalPercentage = (totalCurrent / totalTarget) * 100;
  const monthlyAuto = goals.reduce(
    (sum, g) => sum + g.sources.filter((s) => s.type === "auto").reduce((s, src) => s + src.monthly, 0),
    0
  );

  return (
    <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-gray-700/50 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
          <Target className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-100">סיכום יעדים 2026</h2>
          <p className="text-sm text-gray-400">מעקב כולל</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-emerald-400">{formatCurrency(totalCurrent)}</p>
          <p className="text-xs text-gray-500">נחסך עד עכשיו</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-100">{formatCurrency(totalTarget)}</p>
          <p className="text-xs text-gray-500">יעד שנתי</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-indigo-400">{formatCurrency(monthlyAuto)}</p>
          <p className="text-xs text-gray-500">אוטומטי/חודש</p>
        </div>
      </div>

      <div className="w-full h-3 bg-gray-700/50 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-1000"
          style={{ width: `${Math.min(totalPercentage, 100)}%` }}
        />
      </div>
      <p className="text-right text-sm text-gray-400 mt-1.5">{Math.round(totalPercentage)}% מהיעד הכולל</p>
    </div>
  );
}

function AspirationsCard({ aspirations }: { aspirations: Aspiration[] }) {
  return (
    <div className="bg-gray-800/60 backdrop-blur border border-gray-700/50 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
          <Rocket className="w-5 h-5 text-purple-400" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-100">מכוונים גבוהה 🚀</h2>
          <p className="text-sm text-gray-400">שאיפות ומטרות ארוכות טווח</p>
        </div>
      </div>

      {aspirations[0]?.items.length > 0 ? (
        <ul className="space-y-2">
          {aspirations[0].items.map((item, i) => (
            <li key={i} className="flex items-center gap-2 text-gray-300">
              <span className="text-purple-400">→</span>
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm">בקרוב נוסיף פה את החלומות הגדולים...</p>
          <p className="text-gray-600 text-xs mt-1">נדל"ן, קריירה, חופש כלכלי</p>
        </div>
      )}
    </div>
  );
}

export function GoalsPage({ data }: { data: GoalsData }) {
  return (
    <div className="space-y-6" dir="rtl">
      {/* Summary */}
      <SummaryCard goals={data.financialGoals} />

      {/* Goal cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.financialGoals.map((goal) => (
          <GoalCard key={goal.id} goal={goal} />
        ))}
      </div>

      {/* Aspirations */}
      <AspirationsCard aspirations={data.aspirations} />

      {/* Last updated */}
      <p className="text-center text-xs text-gray-600">
        עודכן לאחרונה: {data.lastUpdated}
      </p>
    </div>
  );
}
