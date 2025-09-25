"use client";

import RenderWhen from "@/components/RenderWhen";
import { ReactNode } from "react";

export interface OptionItem {
  value: string | number;
  label: string;
  description?: string;
  icon?: ReactNode;
}

interface StatusOptionButtonProps {
  option: OptionItem;
  isSelected: boolean;
  onSelect: (value: string | number) => void;
  getOptionClassName?: (value: string | number) => string;
  showSelectionIndicator?: boolean;
  disabled?: boolean;
}

export default function StatusOptionButton({
  option,
  isSelected,
  onSelect,
  getOptionClassName,
  showSelectionIndicator = true,
  disabled = false,
}: StatusOptionButtonProps) {
  function handleClick() {
    if (!disabled) {
      onSelect(option.value);
    }
  }

  const defaultClassName = `w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors duration-150 ${
    isSelected ? "bg-gray-50" : ""
  } ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`;

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={defaultClassName}
      title={option.description}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {option.icon && <div className="flex-shrink-0">{option.icon}</div>}
          <div>
            <div
              className={
                getOptionClassName
                  ? getOptionClassName(option.value)
                  : "font-medium text-gray-900"
              }
            >
              {option.label}
            </div>
            <RenderWhen isTrue={!!option.description}>
              <p className="text-xs text-gray-500 mt-1">{option.description}</p>
            </RenderWhen>
          </div>
        </div>
        <RenderWhen isTrue={isSelected && showSelectionIndicator}>
          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
        </RenderWhen>
      </div>
    </button>
  );
}
