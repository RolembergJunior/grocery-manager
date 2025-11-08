"use client";

import { Product } from "@/app/type";
import { useMemo, useState } from "react";
import ProductDetails from "./components/ProductDetails";
import QuantityInputs from "./components/QuantityInputs";
import DeleteButton from "./components/DeleteButton";
import { ChevronDown, ChevronUp } from "lucide-react";
import RenderWhen from "@/components/RenderWhen";
import StatusSelect from "./components/StatusSelect";
import { toast } from "sonner";
import { updateOrCreate } from "@/services/products";
import { palletColors } from "@/app/utils";
import { useSetAtom } from "jotai";
import { productsAtom } from "@/lib/atoms";

interface ProductCardProps {
  item: Product;
  status: number;
  colorId: number;
}

export default function ProductCard({
  item,
  status,
  colorId,
}: ProductCardProps) {
  const [newItem, setNewItem] = useState(item);
  const [isExpanded, setIsExpanded] = useState(false);

  const setProducts = useSetAtom(productsAtom);

  const hasChanges = useMemo(() => {
    return (
      // newItem.currentQuantity !== item.currentQuantity ||
      // newItem.neededQuantity !== item.neededQuantity ||
      newItem.observation !== item.observation ||
      newItem.statusCompra !== item.statusCompra ||
      newItem.unit !== item.unit ||
      newItem.reccurency !== item.reccurency
    );
  }, [newItem, item]);

  // function handleChangeQuantity(field: keyof Item, value: string) {
  //   const formatedValue = parseFloat(value);

  //   if (formatedValue < 0) {
  //     return toast.error("Não é possível salvar um valor negativo");
  //   }

  //   setNewItem({ ...newItem, [field]: formatedValue });
  // }

  function handleChangeItemProp(
    field: keyof Product,
    value: string | number | null
  ) {
    setNewItem({ ...newItem, [field]: value });
  }

  function handleCancel() {
    setNewItem(item);
  }

  function handleSave() {
    toast.promise(updateOrCreate(newItem), {
      loading: "Salvando...",
      success: () => {
        setProducts((prevState) =>
          prevState.map((item) => (item.id === newItem.id ? newItem : item))
        );

        return "Alterações salvas com sucesso!";
      },
      error: "Erro ao salvar as alterações",
    });
  }

  return (
    <div
      key={item.id}
      className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden transition-all duration-200"
    >
      <div className="flex items-center justify-between p-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 flex-1 text-left"
        >
          <RenderWhen
            isTrue={isExpanded}
            elseElement={<ChevronDown className="w-5 h-5 text-gray-500" />}
          >
            <ChevronUp className="w-5 h-5 text-gray-500" />
          </RenderWhen>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-gray-900 truncate w-35">
              {item.name}
            </h3>
            <span className="text-sm text-gray-500">({item.unit})</span>
          </div>
        </button>

        <div className="flex items-center gap-2">
          <StatusSelect
            currentStatus={newItem.statusCompra}
            onChange={handleChangeItemProp}
          />
          <DeleteButton itemId={item.id} />
        </div>
      </div>

      <RenderWhen isTrue={isExpanded}>
        <div className="px-4 pb-4 space-y-4 border-t border-gray-100 pt-4">
          {/* <QuantityInputs
            currentQuantity={newItem.currentQuantity}
            neededQuantity={newItem.neededQuantity}
            unit={newItem.unit}
            onChangeQuantity={handleChangeQuantity}
            onChange={handleChangeItemProp}
          /> */}

          <ProductDetails
            observation={newItem.observation || ""}
            unit={newItem.unit}
            recurrency={newItem.reccurency}
            onChange={handleChangeItemProp}
          />

          <div className="flex gap-3 mt-3">
            <button
              onClick={handleSave}
              disabled={!hasChanges}
              className={`flex-1 py-2.5 rounded-lg ${
                palletColors[colorId as keyof typeof palletColors].bgClass
              } ${
                palletColors[colorId as keyof typeof palletColors].textClass
              } hover:bg-gray-50 text-gray-700 font-medium transition-all duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:hover:bg-gray-300`}
            >
              Salvar
            </button>
            <button
              onClick={handleCancel}
              className="px-6 py-2.5 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium transition-all duration-200"
            >
              Cancelar
            </button>
          </div>
        </div>
      </RenderWhen>
    </div>
  );
}
