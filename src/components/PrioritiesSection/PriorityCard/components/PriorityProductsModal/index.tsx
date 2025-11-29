"use client";

import { Product, STATUSPRODUCT } from "@/app/type";
import Modal from "@/components/Modal";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { updateStatus } from "@/services/products";
import { useAtomValue, useSetAtom } from "jotai";
import { productsAtom } from "@/lib/atoms/products";
import { categoriesAtom } from "@/lib/atoms/categories";
import { getCategoryName } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PriorityProductsModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  icon: React.ReactNode;
  items: Product[];
  colorClass: string;
}

const statusOptions = [
  {
    value: STATUSPRODUCT.NEED_SHOPPING,
    label: "Comprar",
    color: "bg-[#D31111]",
  },
  {
    value: STATUSPRODUCT.ALMOST_EMPTY,
    label: "Acabando",
    color: "bg-[#FBB94B]",
  },
  {
    value: STATUSPRODUCT.COMPLETED,
    label: "Tem",
    color: "bg-[#BAC639]",
  },
];

export default function PriorityProductsModal({
  isOpen,
  onClose,
  title,
  icon,
  items,
}: PriorityProductsModalProps) {
  const setProducts = useSetAtom(productsAtom);
  const categories = useAtomValue(categoriesAtom);
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());

  const groupedByCategory = useMemo(() => {
    const groups = items.reduce((acc, product) => {
      const categoryId = product.category || "uncategorized";
      const categoryName =
        getCategoryName(categories, categoryId) || "Sem categoria";
      if (!acc[categoryName]) {
        acc[categoryName] = [];
      }
      acc[categoryName].push(product);
      return acc;
    }, {} as Record<string, Product[]>);

    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  }, [items, categories]);

  function getStatusClassName(status: number): string {
    const baseClasses = "px-3 py-1.5 rounded-lg text-xs font-semibold";

    switch (status) {
      case STATUSPRODUCT.NEED_SHOPPING:
        return `${baseClasses} bg-[#D31111] text-white`;
      case STATUSPRODUCT.ALMOST_EMPTY:
        return `${baseClasses} bg-[#FBB94B] text-gray-800`;
      case STATUSPRODUCT.COMPLETED:
        return `${baseClasses} bg-[#BAC639] text-white`;
      default:
        return baseClasses;
    }
  }

  function getStatusLabel(status: number): string {
    const option = statusOptions.find((opt) => opt.value === status);
    return option?.label || "Desconhecido";
  }

  async function handleStatusChange(product: Product, newStatus: number) {
    if (product.statusCompra === newStatus) return;

    setUpdatingItems((prev) => new Set(prev).add(product.id));

    toast.promise(
      updateStatus({
        id: product.id,
        statusCompra: newStatus,
      }),
      {
        loading: "Atualizando status...",
        success: () => {
          setProducts((prev) =>
            prev.map((p) =>
              p.id === product.id ? { ...p, statusCompra: newStatus } : p
            )
          );
          setUpdatingItems((prev) => {
            const next = new Set(prev);
            next.delete(product.id);
            return next;
          });
          return "Status atualizado!";
        },
        error: (err) => {
          setUpdatingItems((prev) => {
            const next = new Set(prev);
            next.delete(product.id);
            return next;
          });
          return "Erro ao atualizar status";
        },
      }
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      iconTitle={icon}
      title={title}
      size="lg"
    >
      <div className="space-y-5">
        {groupedByCategory.map(([category, products]) => (
          <div key={category} className="space-y-2.5">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider border-b-2 border-gray-300 pb-2">
              {category}
            </h3>
            <div className="space-y-2">
              {products.map((product) => {
                const isUpdating = updatingItems.has(product.id);
                return (
                  <div
                    key={product.id}
                    className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-200"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm leading-tight mb-1">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-600">
                        <span className="font-medium">
                          {product.neededQuantity}
                        </span>{" "}
                        {product.unit}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <Select
                        value={product.statusCompra.toString()}
                        onValueChange={(value) =>
                          handleStatusChange(product, parseInt(value))
                        }
                        disabled={isUpdating}
                      >
                        <SelectTrigger
                          size="sm"
                          className={`${getStatusClassName(
                            product.statusCompra
                          )} gap-1 border-0 shadow-sm focus:ring-0 min-w-[110px]`}
                        >
                          <SelectValue>
                            {getStatusLabel(product.statusCompra)}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent className="w-48">
                          {statusOptions.map((option) => (
                            <SelectItem
                              key={option.value}
                              value={option.value.toString()}
                              className="cursor-pointer"
                            >
                              <div className="flex items-center gap-2">
                                <div
                                  className={`w-3 h-3 rounded-full ${option.color}`}
                                />
                                <span className="font-medium">
                                  {option.label}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
}
