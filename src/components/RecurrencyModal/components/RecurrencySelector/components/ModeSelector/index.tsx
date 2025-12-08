import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "lucide-react";

interface ModeSelectorProps {
  mode: "none" | "simple" | "weekly" | "monthly";
  onModeChange: (mode: string) => void;
}

export default function ModeSelector({
  mode,
  onModeChange,
}: ModeSelectorProps) {
  return (
    <div className="w-full">
      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
        <Calendar className="w-4 h-4" />
        Tipo de Recorrência
      </label>
      <Select value={mode} onValueChange={onModeChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Sem recorrência" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">Sem recorrência</SelectItem>
          <SelectItem value="simple">Intervalo Simples</SelectItem>
          <SelectItem value="weekly">Dias da Semana</SelectItem>
          <SelectItem value="monthly">Mensal</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
