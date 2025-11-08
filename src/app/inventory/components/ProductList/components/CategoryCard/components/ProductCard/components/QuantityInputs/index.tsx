import { Product } from "@/app/type";
import { unitOptions } from "@/app/utils";

interface QuantityInputsProps {
  currentQuantity: number;
  neededQuantity: number;
  unit: string;
  onChangeQuantity: (field: keyof Product, value: string) => void;
  onChange: (field: keyof Product, value: string) => void;
}

export default function QuantityInputs({
  currentQuantity,
  neededQuantity,
  unit,
  onChangeQuantity,
  onChange,
}: QuantityInputsProps) {
  return (
    <div className="flex items-center justify-between gap-1">
      <div className="w-1/3">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Eu tenho
        </label>

        <input
          type="number"
          value={currentQuantity}
          onChange={(e) => onChangeQuantity("currentQuantity", e.target.value)}
          className="flex-1 p-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-transparent transition-all duration-200 w-full"
          min="0"
          step="0.1"
        />
      </div>

      <div className="w-1/3">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Unidade
        </label>

        <div className="relative">
          <select
            value={unit}
            onChange={(e) => onChange("unit", e.target.value)}
            className="flex-1 p-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-transparent transition-all duration-200 w-full cursor-pointer appearance-none pr-10"
          >
            {unitOptions.map((unit) => (
              <option key={unit.value} value={unit.value}>
                {unit.value}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
            <svg
              className="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
        </div>
      </div>

      <div className="w-1/3">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Preciso de
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={neededQuantity}
            onChange={(e) => onChangeQuantity("neededQuantity", e.target.value)}
            className="flex-1 p-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-transparent transition-all duration-200 w-full"
            min="0"
            step="0.1"
          />
        </div>
      </div>
    </div>
  );
}
