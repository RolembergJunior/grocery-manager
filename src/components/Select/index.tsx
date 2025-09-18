"use client";

import { useState } from "react";
import RenderWhen from "../RenderWhen";
import { OptionsType } from "@/app/type";

interface SelectProps {
  defaultValue?: string;
  placeholder?: string;
  options: OptionsType[];
  label: string;
  onChange: (e: string | number | null) => void;
}

export default function SelectComponent({
  options,
  defaultValue = "todos",
  onChange = () => {},
  placeholder = "Selecione...",
  label,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string | number | null>(
    defaultValue
  );

  const selectedOption = options.find(
    (option) => option.value === selectedValue
  );

  function handleSelect(option: OptionsType) {
    setSelectedValue(option.value);
    setIsOpen(false);
    onChange(option.value);
  }

  return (
    <div className="space-y-2">
      <RenderWhen isTrue={!!label}>
        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
          {label}
        </label>
      </RenderWhen>
      <div className="relative inline-block w-32">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full p-3 text-left bg-white border border-gray-200 rounded-xl shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200 hover:shadow-md flex items-center justify-between"
        >
          <span className="text-gray-900 text-center font-medium">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <svg
            className={`w-5 h-5 transition-transform duration-200 ${
              isOpen ? "transform rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        <RenderWhen isTrue={isOpen}>
          <div className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl animate-in slide-in-from-top-2 duration-200">
            <div className="max-h-60 overflow-auto p-2">
              <button
                key={"all"}
                type="button"
                onClick={() => handleSelect({ value: "", label: "Todos" })}
                className={`w-full px-4 py-3 text-left hover:bg-blue-50 focus:outline-none focus:bg-blue-50 transition-colors duration-150 rounded-lg ${
                  "" === selectedValue
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "text-gray-700"
                }`}
              >
                <span>Todos</span>
              </button>
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option)}
                  className={`w-full px-4 py-3 text-left hover:bg-blue-50 focus:outline-none focus:bg-blue-50 transition-colors duration-150 rounded-lg ${
                    option.value === selectedValue
                      ? "bg-blue-50 text-blue-700 font-medium"
                      : "text-gray-700"
                  }`}
                >
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        </RenderWhen>
      </div>
    </div>
  );
}
