"use client";

import { Item } from "@/app/type";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { updateOrCreate } from "@/services/products";
import ProductObservation from "./components/ProductObservation";
import StatusSelect from "./components/StatusSelect";
import { Trash2 } from "lucide-react";

interface ProductCardProps {
  item: Item;
  status: string;
  statusText: string;
}

export default function ProductCard({
  item,
  status,
  statusText,
}: ProductCardProps) {
  const [newCurrentQuantity, setNewCurrentQuantity] = useState(
    item.currentQuantity
  );
  const [newNeededQuantity, setNewNeededQuantity] = useState(
    item.neededQuantity
  );
  const [manualStatus, setManualStatus] = useState<string | null>(null);

  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleChangeQuantity(
    value: string,
    field: "currentQuantity" | "neededQuantity"
  ) {
    const formatedValue = parseFloat(value);
    const keyName =
      field === "currentQuantity" ? "currentQuantity" : "neededQuantity";

    if (formatedValue < 0) {
      return toast.error("Não é possível salvar um valor negativo");
    }

    if (keyName === "currentQuantity") {
      setNewCurrentQuantity(formatedValue);
    }

    if (keyName === "neededQuantity") {
      setNewNeededQuantity(formatedValue);
    }

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      toast.promise(
        updateOrCreate({
          ...item,
          [keyName]: formatedValue,
        }),
        {
          loading: "Salvando...",
          success: "Quantidade salva com sucesso!",
          error:
            "Houve um erro ao tentar salvar a quantidade do item. Tente novamente mais tarde, por favor.",
        }
      );
    }, 1000);
  }

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  function handleDeleteItem() {
    if (confirm("Are you sure you want to delete this item?")) {
      return;
    }
  }

  function handleStatusChange(newStatus: string) {
    setManualStatus(newStatus);
  }

  const displayStatus = manualStatus || status;
  const getStatusText = (statusValue: string): string => {
    switch (statusValue) {
      case "needs-shopping":
        return "Preciso comprar";
      case "almost-empty":
        return "Quase acabando";
      case "full":
        return "Tenho suficiente";
      default:
        return statusText;
    }
  };

  return (
    <div
      key={item.id}
      className="group relative p-6 bg-white  border border-gray-200 "
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {item.name}
          </h3>
          <div className="flex items-center gap-2">
            <StatusSelect
              currentStatus={displayStatus}
              statusText={getStatusText(displayStatus)}
              onStatusChange={handleStatusChange}
            />
          </div>
        </div>
        <button
          onClick={handleDeleteItem}
          className="bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 p-2.5 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
          title="Excluir item"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center gap-4 mb-4 w-full">
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 w-1/2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Eu tenho
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={newCurrentQuantity}
              onChange={(e) =>
                handleChangeQuantity(e.target.value, "currentQuantity")
              }
              className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-center font-medium text-gray-900 focus:outline-none transition-all duration-200 hover:border-gray-300 w-full"
              min="0"
              step="0.1"
            />
            <span className="text-sm font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">
              {item.unit}
            </span>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-4 border border-blue-100 w-1/2">
          <label className="block text-sm font-medium text-blue-700 mb-2">
            Eu preciso
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={newNeededQuantity}
              onChange={(e) =>
                handleChangeQuantity(e.target.value, "neededQuantity")
              }
              className="flex-1 px-3 py-2 bg-white border border-blue-200 rounded-lg text-center font-medium text-gray-900 focus:outline-none transition-all duration-200 hover:border-blue-300 w-full"
              min="0"
              step="0.1"
            />
            <span className="text-sm font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">
              {item.unit}
            </span>
          </div>
        </div>
      </div>

      <ProductObservation item={item} />
    </div>
  );
}
