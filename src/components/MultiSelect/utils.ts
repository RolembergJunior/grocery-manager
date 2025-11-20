import { OptionsType } from "@/app/type";

export function getLabelFromOptions(value: string, options: OptionsType[]) {
  return options.find((option) => option.value === value)?.label || value;
}
