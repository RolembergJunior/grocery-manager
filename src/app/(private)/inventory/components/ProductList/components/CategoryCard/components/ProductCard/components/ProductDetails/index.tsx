import { Product, RecurrencyConfig } from "@/app/type";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getRecurrencyDescription, unitOptions } from "@/app/utils";
import { FileText, Package, Calendar, Clock } from "lucide-react";
import { useState } from "react";
import RecurrencyModal from "@/components/RecurrencyModal";

interface ProductDetailsProps {
  observation: string;
  unit: string;
  recurrency: number | null;
  recurrencyConfig: RecurrencyConfig | null;
  onChange: (field: keyof Product, value: any) => void;
}

export default function ProductDetails({
  observation,
  unit,
  recurrency,
  recurrencyConfig,
  onChange,
}: ProductDetailsProps) {
  const [isRecurrencyModalOpen, setIsRecurrencyModalOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="w-full">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <FileText className="w-4 h-4" />
          Observações
        </label>
        <textarea
          value={observation}
          onChange={(e) => onChange("observation", e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg text-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 placeholder-gray-400"
          rows={3}
          placeholder="Adicione notas sobre este produto..."
        />
      </div>

      <div className="w-full">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <Package className="w-4 h-4" />
          Unidade de Medida
        </label>
        <Select value={unit} onValueChange={(value) => onChange("unit", value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione a unidade" />
          </SelectTrigger>
          <SelectContent>
            {unitOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="w-full">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <Calendar className="w-4 h-4" />
          Recorrência de Compra
        </label>
        <button
          onClick={() => setIsRecurrencyModalOpen(true)}
          className="w-full flex items-center justify-between p-3 border border-gray-300 rounded-lg text-left hover:bg-gray-50 transition-colors group"
        >
          <div className="flex items-center gap-2 flex-1">
            <Clock className="w-4 h-4 text-gray-500" />
            <span
              className={`text-sm ${
                recurrencyConfig ? "text-gray-900 font-medium" : "text-gray-500"
              }`}
            >
              {getRecurrencyDescription({
                recurrency,
                recurrencyConfig,
              } as Product)}
            </span>
          </div>
          <div className="text-xs text-blue-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            Configurar
          </div>
        </button>
        <p className="text-xs text-gray-500 mt-1">
          Define com que frequência você compra este item
        </p>
      </div>

      <RecurrencyModal
        isOpen={isRecurrencyModalOpen}
        onClose={() => setIsRecurrencyModalOpen(false)}
        value={recurrencyConfig}
        onSave={(config) => onChange("reccurencyConfig", config)}
      />
    </div>
  );
}
