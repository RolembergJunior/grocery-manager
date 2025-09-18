"use client";

import RenderWhen from "@/components/RenderWhen";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export interface StatusOption {
  value: string;
  label: string;
  description: string;
}

interface StatusSelectProps {
  currentStatus: string;
  statusText: string;
  onStatusChange: (status: string) => void;
  disabled?: boolean;
}

const statusOptions: StatusOption[] = [
  {
    value: "needs-shopping",
    label: "Preciso comprar",
    description: "Item precisa ser comprado",
  },
  {
    value: "almost-empty",
    label: "Quase acabando",
    description: "Item está quase acabando",
  },
  {
    value: "full",
    label: "Tenho suficiente",
    description: "Item está em quantidade adequada",
  },
];

export default function StatusSelect({
  currentStatus,
  statusText,
  onStatusChange,
  disabled = false,
}: StatusSelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getStatusClassName = (
    status: string,
    isSelected: boolean = false
  ): string => {
    const baseClasses = isSelected
      ? "px-3 py-1 rounded-full text-xs font-semibold min-w-fit cursor-pointer"
      : "px-3 py-2 rounded-lg text-sm font-medium cursor-pointer hover:bg-opacity-80 transition-all duration-200";

    switch (status) {
      case "needs-shopping":
        return `${baseClasses} ${
          isSelected
            ? "bg-gradient-to-r from-red-400 to-red-500 text-white"
            : "bg-red-50 text-red-700 hover:bg-red-100"
        }`;
      case "almost-empty":
        return `${baseClasses} ${
          isSelected
            ? "bg-gradient-to-r from-yellow-300 to-yellow-400 text-gray-800"
            : "bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
        }`;
      default:
        return `${baseClasses} ${
          isSelected
            ? "bg-gradient-to-r from-blue-300 to-blue-400 text-white"
            : "bg-blue-50 text-blue-700 hover:bg-blue-100"
        }`;
    }
  };

  const handleStatusSelect = (status: string) => {
    onStatusChange(status);
    setIsOpen(false);
  };

  if (disabled) {
    return (
      <span className={getStatusClassName(currentStatus, true)}>
        {statusText}
      </span>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${getStatusClassName(
          currentStatus,
          true
        )} flex items-center gap-1 hover:scale-105 transition-transform duration-200`}
        title="Clique para alterar o status"
      >
        {statusText}
        <ChevronDown
          className={`w-3 h-3 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <RenderWhen isTrue={isOpen}>
        <>
          <div
            className="fixed inset-0 z-50"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden">
            <div className="py-1">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleStatusSelect(option.value)}
                  className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors duration-150 ${
                    currentStatus === option.value ? "bg-gray-50" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className={getStatusClassName(option.value)}>
                        {option.label}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {option.description}
                      </p>
                    </div>
                    {currentStatus === option.value && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      </RenderWhen>
    </div>
  );
}
