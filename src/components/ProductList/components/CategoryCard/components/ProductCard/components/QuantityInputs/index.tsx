"use client";

import { Item } from "@/app/type";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { updateOrCreate } from "@/services/products";
import { useSetAtom } from "jotai";
import { productsAtom } from "@/lib/atoms";

interface QuantityInputsProps {
  item: Item;
}

export default function QuantityInputs({ item }: QuantityInputsProps) {
  const setProducts = useSetAtom(productsAtom);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleChangeQuantity(
    value: string,
    field: "currentQuantity" | "neededQuantity"
  ) {
    const formatedValue = parseFloat(value);

    if (formatedValue < 0) {
      return toast.error("Não é possível salvar um valor negativo");
    }

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      const updatedItem = {
        ...item,
        [field]: formatedValue,
      };

      toast.promise(updateOrCreate(updatedItem), {
        loading: "Salvando...",
        success: () => {
          setProducts((prevProducts) =>
            prevProducts.map((product) =>
              product.id === item.id
                ? { ...product, [field]: formatedValue }
                : product
            )
          );
          return "Quantidade salva com sucesso!";
        },
        error: (error) => {
          console.error("Error updating quantity:", error);
          return "Houve um erro ao tentar salvar a quantidade do item. Tente novamente mais tarde, por favor.";
        },
      });
    }, 1000);
  }

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="flex items-center gap-4 mb-4 w-full">
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 w-1/2">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Eu tenho
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={item.currentQuantity}
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
            value={item.neededQuantity}
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
  );
}
