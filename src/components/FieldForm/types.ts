import { OptionsType } from "@/app/type";

export type FieldType = "text" | "number" | "select" | "textarea";

export interface BaseFieldProps {
  label?: string;
  value: string | number | null;
  onChange: (value: string | number | null) => void;
  error?: string;
  required?: boolean;
  className?: string;
}

export interface TextFieldProps extends BaseFieldProps {
  type: "text";
  placeholder?: string;
  maxLength?: number;
  disabled?: boolean;
}

export interface NumberFieldProps extends BaseFieldProps {
  type: "number";
  min?: number;
  max?: number;
  disabled?: boolean;
}

export interface SelectFieldProps extends BaseFieldProps {
  type: "select";
  options: OptionsType[];
  placeholder?: string;
  disabled?: boolean;
}

export interface TextareaFieldProps extends BaseFieldProps {
  type: "textarea";
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
