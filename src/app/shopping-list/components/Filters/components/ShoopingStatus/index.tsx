import { useState } from "react";

export default function StatusFilter({
  onFilterChange,
  initialFilter = "all",
}: {
  onFilterChange: (filter: string) => void;
  initialFilter?: string;
}) {
  const [activeFilter, setActiveFilter] = useState(initialFilter);

  const filters = [
    { value: "all", label: "Todos" },
    { value: "comprados", label: "Comprados" },
    { value: "pendentes", label: "Pendentes" },
    { value: "removidos", label: "Removidos" },
  ];

  function handleFilterClick(filterValue: string) {
    setActiveFilter(filterValue);
    onFilterChange(filterValue);
  }

  return (
    <div className="flex justify-center gap-2 p-1 bg-gray-100 rounded-lg">
      {filters.map((filter: { value: string; label: string }) => (
        <button
          key={filter.value}
          onClick={() => handleFilterClick(filter.value)}
          className={`
            px-4 py-2 text-sm font-medium rounded-md transition-all duration-200
            ${
              activeFilter === filter.value
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
            }
          `}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
