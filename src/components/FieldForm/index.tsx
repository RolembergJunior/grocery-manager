"use client";

import { ChangeEvent } from "react";
import { AlertCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FieldFormProps } from "./types";

export default function FieldForm(props: FieldFormProps) {
  const {
    label,
    value,
    onChange,
    error,
    required = false,
    className = "",
    disabled = false,
    defaultValue,
  } = props;

  const baseInputClasses = `w-full p-3 border ${
    error ? "border-red-500" : "border-gray-200"
  } rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200 text-gray-800 shadow-sm hover:shadow-md`;

  function handleTextChange(e: ChangeEvent<HTMLInputElement>) {
    onChange(e.target.value);
  }

  function handleTextareaChange(e: ChangeEvent<HTMLTextAreaElement>) {
    onChange(e.target.value);
  }

  function handleNumberChange(e: ChangeEvent<HTMLInputElement>) {
    onChange(e.target.value ? parseInt(e.target.value) : null);
  }

  function handleSelectChange(value: string) {
    onChange(value);
  }

  function renderInput() {
    switch (props.type) {
      case "text":
        return (
          <input
            type="text"
            value={value || ""}
            onChange={handleTextChange}
            className={`${baseInputClasses} placeholder-gray-400`}
            required={required}
            placeholder={props.placeholder}
            maxLength={props.maxLength}
            disabled={disabled}
          />
        );

      case "number":
        return (
          <input
            type="number"
            value={value || ""}
            onChange={handleNumberChange}
            className={baseInputClasses}
            required={required}
            min={props.min}
            max={props.max}
            disabled={disabled}
            defaultValue={
              defaultValue as string | number | readonly string[] | undefined
            }
          />
        );

      case "select":
        return (
          <Select
            value={value as string}
            onValueChange={handleSelectChange}
            disabled={disabled}
            defaultValue={defaultValue as string | undefined}
          >
            <SelectTrigger
              className={`w-full ${baseInputClasses} ${
                error ? "border-red-500" : "border-gray-200"
              }`}
              size=""
              // defaultValue={
              //   defaultValue as string | number | readonly string[] | undefined
              // }
            >
              <SelectValue placeholder={props.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {props.options?.map((option) => (
                <SelectItem
                  key={option.value?.toString() || ""}
                  value={option.value?.toString() || ""}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "textarea":
        return (
          <textarea
            value={value || ""}
            onChange={handleTextareaChange}
            className={`${baseInputClasses} placeholder-gray-400`}
            required={required}
            placeholder={props.placeholder}
            maxLength={props.maxLength}
            rows={props.rows}
            defaultValue={defaultValue as string}
          />
        );

      default:
        return null;
    }
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
        {label}
      </label>
      {renderInput()}
      {error && (
        <div className="flex items-center gap-1 text-red-600 text-sm mt-1">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
