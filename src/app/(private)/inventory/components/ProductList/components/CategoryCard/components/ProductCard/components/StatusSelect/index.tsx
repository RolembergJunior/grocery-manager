import { buyStatusOptions } from "@/app/utils";
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
  onChange: (status: number) => void;
}

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
      onChange(newStatus);
    }
  }

  function getTextStatus() {
    return buyStatusOptions.find((option) => option.value === currentStatus)
      ?.label;
  }

  if (disabled) {
    return (
      <span className={getStatusClassName(currentStatus)}>
        {getTextStatus()}
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
        <SelectValue>{getTextStatus()}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {buyStatusOptions.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value.toString()}
            className={` ${getItemClassName(
              option.value
            )} rounded-lg my-1 cursor-pointer transition-all duration-200`}
          >
            <span className="font-medium">{option.label}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
