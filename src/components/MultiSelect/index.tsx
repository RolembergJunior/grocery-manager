"use client";

import { useState, useEffect, useRef } from "react";
import { Check, X, ChevronDown } from "lucide-react";
import { OptionsType } from "@/app/type";
import { cn } from "@/lib/utils";
import RenderWhen from "../RenderWhen";

interface MultiSelectProps {
  value?: string[];
  placeholder?: string;
  options: OptionsType[];
  label?: string;
  onChange: (values: string[]) => void;
  showSelectAll?: boolean;
  disabled?: boolean;
  className?: string;
}

export default function MultiSelect({
  options,
  value = [],
  onChange,
  placeholder = "Selecione...",
  label,
  showSelectAll = true,
  disabled = false,
  className,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValues, setSelectedValues] = useState<string[]>(value);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isOpen]);

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => {
        document.removeEventListener("keydown", handleEscape);
      };
    }
  }, [isOpen]);

  const selectedOptions = options.filter((opt) =>
    selectedValues.includes(opt.value as string)
  );
  const allSelected =
    selectedValues.length === options.length && options.length > 0;

  function handleToggleOption(optionValue: string) {
    const newValues = selectedValues.includes(optionValue)
      ? selectedValues.filter((v) => v !== optionValue)
      : [...selectedValues, optionValue];

    setSelectedValues(newValues);
    onChange(newValues);
  }

  function handleSelectAll() {
    const newValues = allSelected
      ? []
      : options.map((opt) => opt.value as string);
    setSelectedValues(newValues);
    onChange(newValues);
  }

  function handleRemoveOption(optionValue: string, e: React.MouseEvent) {
    e.stopPropagation();
    const newValues = selectedValues.filter((v) => v !== optionValue);
    setSelectedValues(newValues);
    onChange(newValues);
  }

  return (
    <div className={cn("relative space-y-2", className)} ref={containerRef}>
      <RenderWhen isTrue={!!label}>
        <label className="text-sm font-medium text-foreground">{label}</label>
      </RenderWhen>

      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={cn(
          "border-input data-[placeholder]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-full items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 min-h-[36px]",
          selectedValues.length === 0 && "text-muted-foreground"
        )}
      >
        <div className="flex-1 flex items-center gap-1.5 flex-wrap">
          <RenderWhen
            isTrue={selectedValues.length > 0}
            elseElement={<span>{placeholder}</span>}
          >
            {selectedOptions.map((option) => (
              <span
                key={option.value}
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-accent text-accent-foreground rounded-md text-xs font-medium border border-border"
              >
                {option.label}
                <div
                  onClick={(e) => handleRemoveOption(option.value as string, e)}
                  className="hover:bg-destructive/10 rounded-sm transition-colors"
                >
                  <X className="w-3 h-3" />
                </div>
              </span>
            ))}
          </RenderWhen>
        </div>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 transition-transform duration-200 text-muted-foreground",
            isOpen && "rotate-180"
          )}
        />
      </button>

      <RenderWhen isTrue={isOpen}>
        <div
          ref={dropdownRef}
          className={cn(
            "bg-popover text-popover-foreground absolute top-full left-0 z-50 mt-1 w-full rounded-md border shadow-md outline-none",
            "animate-in fade-in-0 zoom-in-95 slide-in-from-top-2"
          )}
        >
          <div className="max-h-[300px] overflow-y-auto p-1">
            <RenderWhen
              isTrue={options.length > 0}
              elseElement={
                <div className="py-2 text-center text-sm text-muted-foreground">
                  Sem opções disponíveis
                </div>
              }
            >
              <>
                <RenderWhen isTrue={showSelectAll && options.length > 1}>
                  <button
                    type="button"
                    onClick={handleSelectAll}
                    className="focus:bg-accent focus:text-accent-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 px-2 text-sm outline-none select-none hover:bg-accent transition-colors border-b border-border mb-1"
                  >
                    <div
                      className={cn(
                        "w-4 h-4 border-2 rounded flex items-center justify-center transition-colors shrink-0",
                        allSelected
                          ? "bg-primary border-primary"
                          : "border-input"
                      )}
                    >
                      {allSelected && (
                        <Check className="w-3 h-3 text-primary-foreground" />
                      )}
                    </div>
                    <span className="font-medium">
                      {allSelected ? "Desmarcar todos" : "Selecionar todos"}
                    </span>
                  </button>
                </RenderWhen>

                {options.map((option) => {
                  const isSelected = selectedValues.includes(
                    option.value as string
                  );
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleToggleOption(option.value as string)}
                      className={cn(
                        "focus:bg-accent focus:text-accent-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 px-2 text-sm outline-none select-none hover:bg-accent transition-colors",
                        isSelected && "bg-accent/50"
                      )}
                    >
                      <div
                        className={cn(
                          "w-4 h-4 border-2 rounded flex items-center justify-center transition-colors shrink-0",
                          isSelected
                            ? "bg-primary border-primary"
                            : "border-input"
                        )}
                      >
                        <RenderWhen isTrue={isSelected}>
                          <Check className="w-3 h-3 text-primary-foreground" />
                        </RenderWhen>
                      </div>
                      <span>{option.label}</span>
                    </button>
                  );
                })}
              </>
            </RenderWhen>
          </div>
        </div>
      </RenderWhen>
    </div>
  );
}
