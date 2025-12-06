import { OptionsType } from "@/app/type";

export type FieldType = "text" | "number" | "select" | "textarea";

export interface BaseFieldProps {
  label?: string;
  value: string | number | null;
  defaultValue?: string | number | null;
  onChange: (value: string | number | null) => void;
  error?: string;
  required?: boolean;
  className?: string;
}

export interface TextFieldProps extends BaseFieldProps {
  type: "text";
  defaultValue?: string | number | null;
  placeholder?: string;
  maxLength?: number;
  disabled?: boolean;
}

export interface NumberFieldProps extends BaseFieldProps {
  type: "number";
  defaultValue?: string | number | null;
  min?: number;
  max?: number;
  disabled?: boolean;
}

export interface SelectFieldProps extends BaseFieldProps {
  type: "select";
  defaultValue?: string | number | null;
  options: OptionsType[];
  placeholder?: string;
  disabled?: boolean;
}

export interface TextareaFieldProps extends BaseFieldProps {
  type: "textarea";
  defaultValue?: string | number | null;
  placeholder?: string;
  maxLength?: number;
  rows?: number;
  disabled?: boolean;
}

export type FieldFormProps =
  | TextFieldProps
  | NumberFieldProps
  | SelectFieldProps
  | TextareaFieldProps;
