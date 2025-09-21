"use client";

import { Check } from "lucide-react";
import RenderWhen from "../../../RenderWhen";
import { OptionsType } from "@/app/type";

interface SelectOptionProps {
  option: OptionsType;
  multiSelect: boolean;
  isSelected: boolean;
  selectedValue?: string | null;
  onSelect: (option: OptionsType) => void;
}

export default function SelectOption({
  option,
  multiSelect,
  isSelected,
  selectedValue,
  onSelect,
}: SelectOptionProps) {
  return (
    <button
      key={option.value}
      type="button"
      onClick={() => onSelect(option)}
      className={`w-full px-4 py-3 text-left hover:bg-blue-50 focus:outline-none focus:bg-blue-50 transition-colors duration-150 rounded-lg ${
        multiSelect
          ? isSelected
            ? "bg-blue-50 text-blue-700"
            : "text-gray-700"
          : option.value === selectedValue
          ? "bg-blue-50 text-blue-700 font-medium"
          : "text-gray-700"
      }`}
    >
      <RenderWhen
        isTrue={multiSelect}
        elseElement={<span>{option.label}</span>}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-4 h-4 border-2 rounded flex items-center justify-center ${
              isSelected ? "bg-blue-600 border-blue-600" : "border-gray-300"
            }`}
          >
            {isSelected && <Check className="w-3 h-3 text-white" />}
          </div>
          <span>{option.label}</span>
        </div>
      </RenderWhen>
    </button>
  );
}
