import { Clock } from "lucide-react";
import { SIMPLE_INTERVALS } from "../../constants";

interface SimpleModeProps {
  interval: number;
  onIntervalChange: (interval: number) => void;
}

export default function SimpleMode({
  interval,
  onIntervalChange,
}: SimpleModeProps) {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium text-blue-900">
        <Clock className="w-4 h-4" />
        Repetir a cada:
      </div>
      <div className="grid grid-cols-2 gap-2">
        {SIMPLE_INTERVALS.map((days) => (
          <button
            key={days}
            onClick={() => onIntervalChange(days)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              interval === days
                ? "bg-blue-600 text-white shadow-md"
                : "bg-white text-gray-700 hover:bg-blue-100 border border-gray-300"
            }`}
          >
            {days} dias
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <input
          type="number"
          min="1"
          max="365"
          value={interval}
          onChange={(e) => onIntervalChange(Number(e.target.value))}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Dias personalizados"
        />
        <span className="text-sm text-gray-600">dias</span>
      </div>
    </div>
  );
}
