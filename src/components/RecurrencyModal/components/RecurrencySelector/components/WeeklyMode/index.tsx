import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "lucide-react";
import RenderWhen from "@/components/RenderWhen";
import { WEEKDAYS } from "../../constants";

interface WeeklyModeProps {
  selectedDays: number[];
  interval: number;
  onToggleWeekday: (day: number) => void;
  onIntervalChange: (interval: number) => void;
}

export default function WeeklyMode({
  selectedDays,
  interval,
  onToggleWeekday,
  onIntervalChange,
}: WeeklyModeProps) {
  return (
    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium text-purple-900">
        <Calendar className="w-4 h-4" />
        Selecione os dias da semana:
      </div>
      <div className="grid grid-cols-7 gap-2">
        {WEEKDAYS.map((day) => (
          <button
            key={day.value}
            onClick={() => onToggleWeekday(day.value)}
            className={`aspect-square rounded-lg text-xs font-semibold transition-all ${
              selectedDays.includes(day.value)
                ? "bg-purple-600 text-white shadow-md"
                : "bg-white text-gray-700 hover:bg-purple-100 border border-gray-300"
            }`}
            title={day.fullLabel}
          >
            {day.label}
          </button>
        ))}
      </div>
      <RenderWhen isTrue={selectedDays.length === 0}>
        <p className="text-xs text-red-600">
          Selecione pelo menos um dia da semana
        </p>
      </RenderWhen>
      <div className="pt-2 border-t border-purple-200">
        <label className="text-xs font-medium text-purple-900 mb-2 block">
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
            <SelectItem value="1">1 semana</SelectItem>
            <SelectItem value="2">2 semanas</SelectItem>
            <SelectItem value="3">3 semanas</SelectItem>
            <SelectItem value="4">4 semanas</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
