"use client";

import { X } from "lucide-react";
import { OptionsType } from "@/app/type";

interface SelectedChipProps {
  option: OptionsType;
  onRemove: () => void;
}

export default function SelectedChip({ option, onRemove }: SelectedChipProps) {
  return (
    <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm font-medium">
      <span>{option.label}</span>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="hover:bg-blue-200 rounded-full p-0.5 transition-colors ml-1"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}
