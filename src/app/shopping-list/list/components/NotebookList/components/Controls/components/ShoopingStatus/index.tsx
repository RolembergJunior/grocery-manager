import { Check, Circle, Trash } from "lucide-react";
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
    { value: "comprados", label: <Check className="w-4 h-4 text-green-500" /> },
    {
      value: "pendentes",
      label: <Circle className="w-4 h-4 text-yellow-500" />,
    },
    { value: "removidos", label: <Trash className="w-4 h-4 text-red-500" /> },
  ];

  function handleFilterClick(filterValue: string) {
    setActiveFilter(filterValue);
    onFilterChange(filterValue);
  }

  return (
    <div className="flex justify-between gap-2 p-1 bg-gray-100 rounded-lg">
      {filters.map((filter: { value: string; label: React.ReactNode }) => (
        <button
          key={filter.value}
          onClick={() => handleFilterClick(filter.value)}
          className={` flex  justify-center
            px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 w-full
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
