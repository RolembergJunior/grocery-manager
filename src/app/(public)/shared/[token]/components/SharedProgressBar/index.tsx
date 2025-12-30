"use client";

import { ShoppingCart, CheckCircle2 } from "lucide-react";

interface SharedProgressBarProps {
  checkedCount: number;
  totalCount: number;
  progressPercentage: number;
}

export default function SharedProgressBar({
  checkedCount,
  totalCount,
  progressPercentage,
}: SharedProgressBarProps) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <ShoppingCart className="w-5 h-5 text-[var(--color-blue)]" />
          <span className="text-sm font-medium text-gray-700">Progresso</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-green-500" />
          <span className="text-sm font-semibold text-gray-800">
            {checkedCount}/{totalCount}
          </span>
        </div>
      </div>

      <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[var(--color-blue)] to-blue-400 transition-all duration-500 ease-out rounded-full"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      <p className="text-xs text-gray-500 mt-2 text-center">
        {progressPercentage === 100
          ? "🎉 Lista completa!"
          : `${progressPercentage.toFixed(0)}% concluído`}
      </p>
    </div>
  );
}
