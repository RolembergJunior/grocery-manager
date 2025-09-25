"use client";

import RenderWhen from "@/components/RenderWhen";
import { ChevronDown, Loader2 } from "lucide-react";
import { useState } from "react";
import { getStatusText } from "../../utils";
import StatusOptionButton, {
  OptionItem,
} from "./components/StatusOptionButton";
import { useSetAtom } from "jotai";
import { toast } from "sonner";
import { updateOrCreate } from "@/services/products";
import { Item } from "@/app/type";
import { productsAtom } from "@/lib/atoms";

export interface StatusOption {
  value: number;
  label: string;
  description: string;
}

interface StatusSelectProps {
  currentStatus: number;
  item: Item;
  disabled?: boolean;
}

const statusOptions: OptionItem[] = [
  {
    value: 1,
    label: "Preciso comprar",
    description: "Item precisa ser comprado",
  },
  {
    value: 2,
    label: "Quase acabando",
    description: "Item está quase acabando",
  },
  {
    value: 3,
    label: "Tenho suficiente",
    description: "Item está em quantidade adequada",
  },
];

export default function StatusSelect({
  currentStatus,
  disabled = false,
  item,
}: StatusSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const setProducts = useSetAtom(productsAtom);

  function getStatusClassName(
    status: number,
    isSelected: boolean = false
  ): string {
    const baseClasses = isSelected
      ? "px-3 py-1 rounded-full text-xs font-semibold min-w-fit cursor-pointer"
      : "px-3 py-2 rounded-lg text-sm font-medium cursor-pointer hover:bg-opacity-80 transition-all duration-200";

    switch (status) {
      case 1:
        return `${baseClasses} ${
          isSelected
            ? "bg-gradient-to-r from-red-400 to-red-500 text-white"
            : "bg-red-50 text-red-700 hover:bg-red-100"
        }`;
      case 2:
        return `${baseClasses} ${
          isSelected
            ? "bg-gradient-to-r from-yellow-300 to-yellow-400 text-gray-800"
            : "bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
        }`;
      case 3:
        return `${baseClasses} ${
          isSelected
            ? "bg-gradient-to-r from-blue-300 to-blue-400 text-white"
            : "bg-blue-50 text-blue-700 hover:bg-blue-100"
        }`;
      default:
        return baseClasses;
    }
  }

  async function handleStatusSelect(status: string | number) {
    const newStatus = status as number;

    if (newStatus === currentStatus) {
      setIsOpen(false);
      return;
    }

    const updatedItem = {
      ...item,
      statusCompra: newStatus,
    };

    toast.promise(updateOrCreate(updatedItem), {
      loading: "Atualizando status...",
      success: (result) => {
        if (result && typeof result === "object" && "id" in result) {
          setProducts((prevProducts: Item[]) =>
            prevProducts.map((product) =>
              product.id === item.id ? { ...updatedItem } : product
            )
          );
        }
        return "Status atualizado!";
      },
      error: "Erro ao atualizar status",
    });

    setIsOpen(false);
  }

  if (disabled) {
    return (
      <span className={getStatusClassName(currentStatus, true)}>
        {getStatusText(currentStatus)}
      </span>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${getStatusClassName(
          currentStatus,
          true
        )} flex items-center gap-1 hover:scale-105 transition-transform duration-200`}
        title="Clique para alterar o status"
      >
        {getStatusText(currentStatus)}
        <ChevronDown
          className={`w-3 h-3 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <RenderWhen isTrue={isOpen}>
        <div className="z-50">
          <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden">
            <div className="py-1">
              {statusOptions.map((option) => (
                <StatusOptionButton
                  key={option.value}
                  option={option}
                  isSelected={currentStatus === option.value}
                  onSelect={handleStatusSelect}
                  getOptionClassName={(value) =>
                    getStatusClassName(value as number)
                  }
                />
              ))}
            </div>
          </div>
        </div>
      </RenderWhen>
    </div>
  );
}
