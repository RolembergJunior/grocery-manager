import { OptionsType } from "@/app/type";

export type FieldType = "text" | "number" | "select" | "textarea";

export interface BaseFieldProps {
  label: string;
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
}

export interface NumberFieldProps extends BaseFieldProps {
  type: "number";
  min?: number;
  max?: number;
}

export interface SelectFieldProps extends BaseFieldProps {
  type: "select";
  options: OptionsType[];
  placeholder?: string;
}

export interface TextareaFieldProps extends BaseFieldProps {
  type: "textarea";
  placeholder?: string;
  maxLength?: number;
  rows?: number;
}

export type FieldFormProps =
  | TextFieldProps
  | NumberFieldProps
  | SelectFieldProps
  | TextareaFieldProps;
