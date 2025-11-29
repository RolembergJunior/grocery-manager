import { Product } from "@/app/type";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { unitOptions } from "@/app/utils";
import { Calendar, FileText, Package } from "lucide-react";

interface ProductDetailsProps {
  observation: string;
  unit: string;
  recurrency: number | null;
  onChange: (field: keyof Product, value: string | number | null) => void;
}

const recurrencyOptions = [
  { value: null, label: "Sem recorrência" },
  { value: 7, label: "Semanal (7 dias)" },
  { value: 14, label: "Quinzenal (14 dias)" },
  { value: 30, label: "Mensal (30 dias)" },
  { value: 60, label: "Bimestral (60 dias)" },
  { value: 90, label: "Trimestral (90 dias)" },
];

export default function ProductDetails({
  observation,
  unit,
  recurrency,
  onChange,
}: ProductDetailsProps) {
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="w-full">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Package className="w-4 h-4" />
            Unidade de Medida
          </label>
          <Select
            value={unit}
            onValueChange={(value) => onChange("unit", value)}
          >
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
          <Select
            value={recurrency?.toString() || "null"}
            onValueChange={(value) =>
              onChange("reccurency", value === "null" ? null : parseInt(value))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sem recorrência" />
            </SelectTrigger>
            <SelectContent>
              {recurrencyOptions.map((option) => (
                <SelectItem
                  key={option.value?.toString() || "null"}
                  value={option.value?.toString() || "null"}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500 mt-1">
            Define com que frequência você compra este item
          </p>
        </div>
      </div>
    </div>
  );
}
