"use client";

import { useMemo } from "react";
import { Calendar } from "@/components/ui/calendar";

interface RecurrencyCalendarProps {
  dates: Date[];
  onDateSelect: (date: Date | null) => void;
  selectedDate: Date | null;
}

export default function RecurrencyCalendar({
  dates,
  onDateSelect,
  selectedDate,
}: RecurrencyCalendarProps) {
  const dateMap = useMemo(() => {
    const map = new Map<string, { count: number; isPast: boolean }>();
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    dates.forEach((date) => {
      const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      const dateOnly = new Date(date);
      dateOnly.setHours(0, 0, 0, 0);
      const isPast = dateOnly < now;

      const existing = map.get(key);
      map.set(key, {
        count: (existing?.count || 0) + 1,
        isPast: existing?.isPast || isPast,
      });
    });

    return map;
  }, [dates]);

  function getDateKey(date: Date): string {
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  }

  function isSameDay(date1: Date | null, date2: Date | null): boolean {
    if (!date1 || !date2) return false;
    return getDateKey(date1) === getDateKey(date2);
  }

  const datesWithItems = useMemo(() => {
    return dates.map((date) => {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      return d;
    });
  }, [dates]);

  const overdueDates = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    return dates
      .filter((date) => {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        return d < now;
      })
      .map((date) => {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        return d;
      });
  }, [dates]);

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) {
      onDateSelect(null);
      return;
    }

    const dateInfo = dateMap.get(getDateKey(date));
    if (!dateInfo) {
      return;
    }

    if (isSameDay(date, selectedDate)) {
      onDateSelect(null);
    } else {
      onDateSelect(date);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <Calendar
        mode="single"
        selected={selectedDate || undefined}
        onSelect={handleDateSelect}
        modifiers={{
          hasItems: datesWithItems,
          overdue: overdueDates,
        }}
        modifiersClassNames={{
          hasItems: "bg-blue-100 text-blue-700 hover:bg-blue-200 font-semibold",
          overdue: "bg-red-100 text-red-700 hover:bg-red-200 font-semibold",
        }}
        components={{
          DayButton: ({ day, modifiers, ...props }) => {
            const dateInfo = dateMap.get(getDateKey(day.date));
            const hasItems = dateInfo && dateInfo.count > 0;
            return (
              <button
                {...props}
                className={`
                          relative flex flex-col items-center justify-center w-8 h-full rounded-lg text-sm font-medium transition-all
                          ${
                            hasItems
                              ? dateInfo.isPast
                                ? "bg-red-100 text-red-700 hover:bg-red-200 cursor-pointer"
                                : "bg-blue-100 text-blue hover:bg-blue-200 cursor-pointer"
                              : "text-gray-400 cursor-not-allowed opacity-80"
                          }
                          ${
                            selectedDate && isSameDay(day.date, selectedDate)
                              ? "ring-2 ring-blue-500 bg-blue-500 text-white hover:bg-blue-600"
                              : ""
                          }
                          ${
                            modifiers.today &&
                            !isSameDay(day.date, selectedDate)
                              ? "ring-2 ring-gray-300"
                              : ""
                          }
                        `}
                disabled={!hasItems}
              >
                <span>{day.date.getDate()}</span>
              </button>
            );
          },
        }}
      />

      <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-red-100 border border-red-300" />
          <span className="text-xs text-gray-600">Atrasado</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-blue-100 border border-blue-300" />
          <span className="text-xs text-gray-600">Futuro</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-blue-500" />
          <span className="text-xs text-gray-600">Selecionado</span>
        </div>
      </div>
    </div>
  );
}
