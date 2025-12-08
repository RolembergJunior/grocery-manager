import { X } from "lucide-react";
import { WEEKDAYS, WEEK_POSITIONS } from "../../constants";

interface RecurrencySummaryProps {
  mode: "simple" | "weekly" | "monthly";
  interval: number;
  selectedDays: number[];
  monthlyType: "day_of_month" | "day_of_week";
  dayOfMonth: number;
  weekOfMonth: number;
  dayOfWeek: number;
  onRemove: () => void;
}

export default function RecurrencySummary({
  mode,
  interval,
  selectedDays,
  monthlyType,
  dayOfMonth,
  weekOfMonth,
  dayOfWeek,
  onRemove,
}: RecurrencySummaryProps) {
  function getSummaryText() {
    if (mode === "simple") {
      return `A cada ${interval} dias`;
    }

    if (mode === "weekly") {
      if (selectedDays.length === 0) {
        return (
          <span className="text-red-600">Selecione os dias da semana</span>
        );
      }
      return `Toda${
        interval > 1 ? `s ${interval} semanas em` : ""
      } ${selectedDays.map((d) => WEEKDAYS[d].fullLabel).join(", ")}`;
    }

    if (mode === "monthly") {
      if (monthlyType === "day_of_month") {
        return `Todo dia ${dayOfMonth} do mês${
          interval > 1 ? ` (a cada ${interval} meses)` : ""
        }`;
      }
      const position =
        weekOfMonth === -1
          ? "Última"
          : WEEK_POSITIONS.find((w) => w.value === weekOfMonth)?.label;
      return `${position} ${WEEKDAYS[dayOfWeek].fullLabel} do mês${
        interval > 1 ? ` (a cada ${interval} meses)` : ""
      }`;
    }

    return "";
  }

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
      <div className="flex items-start gap-2">
        <div className="flex-1">
          <p className="text-xs font-medium text-gray-700 mb-1">
            Resumo da Recorrência:
          </p>
          <p className="text-sm text-gray-900">{getSummaryText()}</p>
        </div>
        <button
          onClick={onRemove}
          className="p-1 rounded-lg hover:bg-gray-200 transition-colors"
          title="Remover recorrência"
        >
          <X className="w-4 h-4 text-gray-600" />
        </button>
      </div>
    </div>
  );
}
