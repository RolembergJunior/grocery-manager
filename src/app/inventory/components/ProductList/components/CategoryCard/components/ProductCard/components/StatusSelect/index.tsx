import { getStatusText } from "../../utils";
import { Product } from "@/app/type";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface StatusOption {
  value: number;
  label: string;
  description: string;
}

interface StatusSelectProps {
  currentStatus: number;
  disabled?: boolean;
  onChange: (field: keyof Product, status: number) => void;
}

const statusOptions: StatusOption[] = [
  {
    value: 1,
    label: "Comprar",
    description: "Item precisa ser comprado",
  },
  {
    value: 2,
    label: "Acabando",
    description: "Item está quase acabando",
  },
  {
    value: 3,
    label: "Tem",
    description: "Item está em quantidade adequada",
  },
];

export default function StatusSelect({
  currentStatus,
  disabled = false,
  onChange,
}: StatusSelectProps) {
  function getStatusClassName(status: number): string {
    const baseClasses =
      "px-3 py-1 rounded-full text-xs font-semibold min-w-fit";

    switch (status) {
      case 1:
        return `${baseClasses} bg-[#D31111] text-white`;
      case 2:
        return `${baseClasses} bg-[#FBB94B] text-gray-800`;
      case 3:
        return `${baseClasses} bg-[#BAC639] text-white`;
      default:
        return baseClasses;
    }
  }

  function getItemClassName(status: number): string {
    switch (status) {
      case 1:
        return "bg-[#D31111] text-white focus:bg-[#D31111]/50";
      case 2:
        return "bg-[#FBB94B] text-white focus:bg-[#FBB94B]/50";
      case 3:
        return "bg-[#BAC639] text-white focus:bg-[#BAC639]/50";
      default:
        return "";
    }
  }

  function handleStatusChange(value: string) {
    const newStatus = parseInt(value);
    if (newStatus !== currentStatus) {
      onChange("statusCompra", newStatus);
    }
  }

  if (disabled) {
    return (
      <span className={getStatusClassName(currentStatus)}>
        {getStatusText(currentStatus)}
      </span>
    );
  }

  return (
    <Select
      value={currentStatus.toString()}
      onValueChange={handleStatusChange}
      disabled={disabled}
    >
      <SelectTrigger
        size="sm"
        className={`${getStatusClassName(
          currentStatus
        )} gap-1 border-0 shadow-none focus:ring-0`}
        title="Clique para alterar o status"
      >
        <SelectValue>{getStatusText(currentStatus)}</SelectValue>
      </SelectTrigger>
      <SelectContent className="w-56">
        {statusOptions.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value.toString()}
            className={`${getItemClassName(
              option.value
            )} rounded-lg my-1 cursor-pointer transition-all duration-200`}
          >
            <div className="flex flex-col">
              <span className="font-medium">{option.label}</span>
              <span className="text-xs opacity-70">{option.description}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
