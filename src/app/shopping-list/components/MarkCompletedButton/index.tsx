"use client";

import { Check, ChevronDown } from "lucide-react";
import { useState } from "react";

export default function MarkCompletedButton({
  progressPercentage,
  completedCount,
  totalCount,
  onListCompleted,
}: {
  progressPercentage: number;
  completedCount: number;
  totalCount: number;
  onListCompleted: () => void;
}) {
  const [isBottomExpanded, setIsBottomExpanded] = useState(false);

  return (
    <>
      <div
        className={`fixed bottom-17 left-1/2 transform -translate-x-1/2 w-full bg-white border-t border-gray-200 transition-all duration-300 ${
          isBottomExpanded ? "pb-4" : "pb-2"
        }`}
      >
        <div className={`px-4 ${isBottomExpanded ? "pt-4" : "pt-2"}`}>
          <div
            className="cursor-pointer"
            onClick={() => setIsBottomExpanded(!isBottomExpanded)}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                Progresso da compra
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">
                  {progressPercentage}%
                </span>
                <div
                  className={`transition-transform duration-300 ${
                    isBottomExpanded ? "rotate-180" : "rotate-0"
                  }`}
                >
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </div>
              </div>
            </div>
            <div className="text-xs text-gray-500 mb-2">
              {completedCount} of {totalCount}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>

          <div
            className={`transition-all duration-300 overflow-hidden ${
              isBottomExpanded
                ? "max-h-20 opacity-100 mt-4"
                : "max-h-0 opacity-0 mt-0"
            }`}
          >
            <button
              className="w-full bg-green-500 text-white py-3 rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              disabled={completedCount === 0}
              onClick={onListCompleted}
            >
              <Check className="w-5 h-5" />
              Marcar lista como completa
            </button>
          </div>
        </div>
      </div>

      <div
        className={`transition-all duration-300 ${
          isBottomExpanded ? "h-32" : "h-16"
        }`}
      ></div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #d97706;
          cursor: pointer;
        }

        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #d97706;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </>
  );
}
