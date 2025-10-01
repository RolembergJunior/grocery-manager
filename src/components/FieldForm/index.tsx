"use client";

import { ChangeEvent } from "react";
import { AlertCircle } from "lucide-react";
import Select from "@/components/Select";
import { FieldFormProps } from "./types";

export default function FieldForm(props: FieldFormProps) {
  const {
    label,
    value,
    onChange,
    error,
    required = false,
    className = "",
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

  function handleSelectChange(values: string[]) {
    onChange(values[0]);
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
          />
        );

      case "select":
        return (
          <Select
            defaultValue={value as string}
            onChange={handleSelectChange}
            options={props.options}
            className={`${
              error ? "border-red-500 placeholder-red-400" : "border-gray-200"
            } w-full placeholder-gray-400`}
            placeholder={props.placeholder}
          />
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
