"use client";

import { useState, useEffect } from "react";
import { Check, X, ChevronDown } from "lucide-react";
import RenderWhen from "../RenderWhen";
import { OptionsType } from "@/app/type";
import SelectedChip from "./components/SelectedChip";
import SelectOption from "./components/SelectOptions";

interface SelectProps {
  defaultValue?: string | string[];
  placeholder?: string;
  options: OptionsType[];
  label?: string;
  onChange: (e: string[]) => void;
  multiSelect?: boolean;
  showSelectAll?: boolean;
}

export default function SelectComponent({
  options,
  defaultValue = "todos",
  onChange,
  placeholder = "Selecione...",
  label,
  multiSelect = false,
  showSelectAll = false,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string | null>(
    multiSelect ? null : (defaultValue as string)
  );
  const [selectedMap, setSelectedMap] = useState<Map<string, OptionsType>>(
    new Map()
  );

  useEffect(() => {
    if (multiSelect && Array.isArray(defaultValue)) {
      const newMap = new Map<string, OptionsType>();
      defaultValue.forEach((value) => {
        const option = options.find((opt) => opt.value === value);
        if (option) {
          newMap.set(value, option);
        }
      });
      setSelectedMap(newMap);
    } else if (!multiSelect && typeof defaultValue === "string") {
      setSelectedValue(defaultValue);
    }
  }, [defaultValue, multiSelect, options]);

  const selectedOptions = Array.from(selectedMap.values());
  const selectedValues = Array.from(selectedMap.keys());
  const allSelected = selectedMap.size === options.length;

  function handleSingleSelect(option: OptionsType) {
    setSelectedValue(option.value as string);
    setIsOpen(false);
    onChange([option.value as string]);
  }

  function handleMultiSelect(option: OptionsType) {
    const value = option.value as string;
    const newMap = new Map(selectedMap);

    if (newMap.has(value)) {
      newMap.delete(value);
    } else {
      newMap.set(value, option);
    }

    setSelectedMap(newMap);
    onChange(Array.from(newMap.keys()));
  }

  function handleSelectAll() {
    const newMap = new Map<string, OptionsType>();

    if (!allSelected) {
      options.forEach((option) => {
        newMap.set(option.value as string, option);
      });
    }

    setSelectedMap(newMap);
    onChange(Array.from(newMap.keys()));
  }

  function removeMultiSelectedItem(valueToRemove: string) {
    const newMap = new Map(selectedMap);
    newMap.delete(valueToRemove);
    setSelectedMap(newMap);
    onChange(Array.from(newMap.keys()));
  }

  return (
    <div className="space-y-2">
      <RenderWhen isTrue={!!label}>
        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
          {label}
        </label>
      </RenderWhen>

      <div className="relative inline-block w-full">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full p-3 text-left bg-white border border-gray-200 rounded-xl shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200 hover:shadow-md flex items-center justify-between min-h-[48px]"
        >
          <div className="flex-1 flex items-center gap-2 flex-wrap">
            <RenderWhen isTrue={multiSelect}>
              <RenderWhen
                isTrue={!!selectedValues.length}
                elseElement={
                  <span className="text-gray-500 font-medium">
                    {placeholder}
                  </span>
                }
              >
                {selectedOptions.map((option) => (
                  <SelectedChip
                    key={option.value}
                    option={option}
                    onRemove={() =>
                      removeMultiSelectedItem(option.value as string)
                    }
                  />
                ))}
              </RenderWhen>
            </RenderWhen>

            <RenderWhen isTrue={!multiSelect}>
              <div className="flex items-center justify-between w-full">
                <span className="text-gray-500 font-medium">
                  {selectedValue ? selectedValue : placeholder}
                </span>
              </div>
            </RenderWhen>
          </div>
          <ChevronDown
            className={`w-5 h-5 transition-transform duration-200 flex-shrink-0 ml-2 ${
              isOpen ? "transform rotate-180" : ""
            }`}
          />
        </button>

        <RenderWhen isTrue={isOpen}>
          <div className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl animate-in slide-in-from-top-2 duration-200">
            <div className="max-h-60 overflow-auto p-2">
              <RenderWhen
                isTrue={multiSelect && showSelectAll && options.length > 1}
              >
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors duration-150 rounded-lg border-b border-gray-100 mb-2 font-medium text-gray-700"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-4 h-4 border-2 rounded flex items-center justify-center ${
                        allSelected
                          ? "bg-blue-600 border-blue-600"
                          : "border-gray-300"
                      }`}
                    >
                      {allSelected && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <span>
                      {allSelected ? "Desmarcar todos" : "Selecionar todos"}
                    </span>
                  </div>
                </button>
              </RenderWhen>

              {options.map((option) => (
                <SelectOption
                  key={option.value}
                  option={option}
                  multiSelect={multiSelect}
                  isSelected={selectedMap.has(option.value as string)}
                  selectedValue={selectedValue}
                  onSelect={(option) =>
                    multiSelect
                      ? handleMultiSelect(option)
                      : handleSingleSelect(option)
                  }
                />
              ))}
            </div>
          </div>
        </RenderWhen>
      </div>
    </div>
  );
}
