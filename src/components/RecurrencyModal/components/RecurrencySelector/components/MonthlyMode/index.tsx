import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "lucide-react";
import RenderWhen from "@/components/RenderWhen";
import { WEEKDAYS, WEEK_POSITIONS } from "../../constants";

interface MonthlyModeProps {
  monthlyType: "day_of_month" | "day_of_week";
  dayOfMonth: number;
  weekOfMonth: number;
  dayOfWeek: number;
  interval: number;
  onMonthlyTypeChange: (type: "day_of_month" | "day_of_week") => void;
  onDayOfMonthChange: (day: number) => void;
  onWeekOfMonthChange: (week: number) => void;
  onDayOfWeekChange: (day: number) => void;
  onIntervalChange: (interval: number) => void;
}

export default function MonthlyMode({
  monthlyType,
  dayOfMonth,
  weekOfMonth,
  dayOfWeek,
  interval,
  onMonthlyTypeChange,
  onDayOfMonthChange,
  onWeekOfMonthChange,
  onDayOfWeekChange,
  onIntervalChange,
}: MonthlyModeProps) {
  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium text-green-900">
        <Calendar className="w-4 h-4" />
        Recorrência Mensal:
      </div>

      {/* Monthly Type Selector */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => onMonthlyTypeChange("day_of_month")}
          className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
            monthlyType === "day_of_month"
              ? "bg-green-600 text-white shadow-md"
              : "bg-white text-gray-700 hover:bg-green-100 border border-gray-300"
          }`}
        >
          Dia do Mês
        </button>
        <button
          onClick={() => onMonthlyTypeChange("day_of_week")}
          className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
            monthlyType === "day_of_week"
              ? "bg-green-600 text-white shadow-md"
              : "bg-white text-gray-700 hover:bg-green-100 border border-gray-300"
          }`}
        >
          Dia da Semana
        </button>
      </div>

      {/* Day of Month */}
      <RenderWhen isTrue={monthlyType === "day_of_month"}>
        <div className="space-y-2">
          <label className="text-xs font-medium text-green-900">
            Dia do mês:
          </label>
          <div className="grid grid-cols-7 gap-1.5">
            {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
              <button
                key={day}
                onClick={() => onDayOfMonthChange(day)}
                className={`aspect-square rounded-lg text-xs font-semibold transition-all ${
                  dayOfMonth === day
                    ? "bg-green-600 text-white shadow-md"
                    : "bg-white text-gray-700 hover:bg-green-100 border border-gray-300"
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
      </RenderWhen>

      {/* Day of Week in Month */}
      <RenderWhen isTrue={monthlyType === "day_of_week"}>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-green-900 mb-2 block">
              Posição no mês:
            </label>
            <Select
              value={weekOfMonth.toString()}
              onValueChange={(v) => onWeekOfMonthChange(Number(v))}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {WEEK_POSITIONS.map((week) => (
                  <SelectItem key={week.value} value={week.value.toString()}>
                    {week.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs font-medium text-green-900 mb-2 block">
              Dia da semana:
            </label>
            <Select
              value={dayOfWeek.toString()}
              onValueChange={(v) => onDayOfWeekChange(Number(v))}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {WEEKDAYS.map((day) => (
                  <SelectItem key={day.value} value={day.value.toString()}>
                    {day.fullLabel}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </RenderWhen>

      {/* Interval */}
      <div className="pt-2 border-t border-green-200">
        <label className="text-xs font-medium text-green-900 mb-2 block">
          Repetir a cada:
        </label>
        <Select
          value={interval.toString()}
          onValueChange={(v) => onIntervalChange(Number(v))}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1 mês</SelectItem>
            <SelectItem value="2">2 meses</SelectItem>
            <SelectItem value="3">3 meses</SelectItem>
            <SelectItem value="6">6 meses</SelectItem>
            <SelectItem value="12">12 meses</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
