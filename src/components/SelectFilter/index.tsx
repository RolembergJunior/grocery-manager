"use client";

import Select from "../MultiSelect";

type SelectFilterProps = {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
};

export default function SelectFilter({
  value,
  onChange,
  options,
  ...props
}: SelectFilterProps) {
  return (
    <>
      <Select
        defaultValue={value}
        onChange={onChange}
        label="Filtrar por status"
        options={options}
        {...props}
      />

      <Select
        defaultValue={value}
        onChange={onChange}
        label="Filtrar por categoria"
        options={options}
      />
    </>
  );
}
