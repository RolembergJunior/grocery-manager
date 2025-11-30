"use client";

import { Product, Category } from "@/app/type";
import { useState, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { formatCategoryTitle } from "./utils";
import ProductCard from "./components/ProductCard";
import EmptyState from "./components/EmptyState";
import RenderWhen from "@/components/RenderWhen";
import { palletColors } from "@/app/utils";
import CreateItemButton from "./components/CreateItemButton";
import AlertDialog from "@/components/AlertDialog";
import CreateCategoryModal from "@/components/Controls/CreateCategoryModal";
import { deleteCategory } from "@/services/categories";
import { toast } from "sonner";
import { useSetAtom } from "jotai";
import { categoriesAtom } from "@/lib/atoms/categories";

interface CategoryCardProps {
  category: Category;
  items: Product[];
  totalItems: number;
}

export default function CategoryCard({
  category,
  items,
  totalItems,
}: CategoryCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);

  const setCategories = useSetAtom(categoriesAtom);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isLongPressRef = useRef(false);

  const statusCounts = items.reduce(
    (acc, item) => {
      const status = item.statusCompra;
      if (status === 1) acc.comprar++;
      else if (status === 2) acc.acabando++;
      else if (status === 3) acc.tem++;
      return acc;
    },
    { comprar: 0, acabando: 0, tem: 0 }
  );

  function handleLongPressStart() {
    isLongPressRef.current = false;
    longPressTimerRef.current = setTimeout(() => {
      isLongPressRef.current = true;
      setIsActionDialogOpen(true);
    }, 500);
  }

  function handleLongPressEnd() {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }

  function handleCardClick() {
    if (!isLongPressRef.current) {
      setIsOpen(!isOpen);
    }
    isLongPressRef.current = false;
  }

  function handleEdit() {
    setIsEditModalOpen(true);
  }

  function handleDeleteClick() {
    setIsDeleteAlertOpen(true);
  }

  function confirmDelete() {
    toast.promise(deleteCategory(category.id), {
      loading: "Excluindo categoria...",
      success: () => {
        setCategories((prev) => prev.filter((cat) => cat.id !== category.id));
        return "Categoria excluída com sucesso!";
      },
      error: "Erro ao excluir categoria. Tente novamente.",
    });
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all">
      <button
        onClick={handleCardClick}
        onMouseLeave={handleLongPressEnd}
        onTouchStart={handleLongPressStart}
        onTouchEnd={handleLongPressEnd}
        className={`${
          palletColors[category.colorId as keyof typeof palletColors].bgClass
        } ${
          palletColors[category.colorId as keyof typeof palletColors].textClass
        } ${
          palletColors[category.colorId as keyof typeof palletColors]
            .borderClass
        } w-full p-2 flex flex-col gap-2 items-center justify-between transition-all cursor-pointer active:scale-95`}
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            <ChevronDown
              className={`w-6 h-6 text-white transition-transform duration-300 ${
                isOpen ? "rotate-0" : "-rotate-90"
              }`}
            />

            <h3
              className={`${
                palletColors[category.colorId as keyof typeof palletColors]
                  .textClass
              } text-xl font-bold capitalize`}
            >
              {formatCategoryTitle(category.name)}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <RenderWhen isTrue={statusCounts.comprar > 0}>
                <div className="bg-white text-red-400 w-8 h-8 flex items-center justify-center rounded-full font-semibold">
                  <span>{statusCounts.comprar}</span>
                </div>
              </RenderWhen>
              <RenderWhen isTrue={statusCounts.acabando > 0}>
                <div className="bg-white text-orange-400 w-8 h-8 flex items-center justify-center rounded-full font-semibold">
                  <span>{statusCounts.acabando}</span>
                </div>
              </RenderWhen>
              <RenderWhen isTrue={statusCounts.tem > 0}>
                <div className="bg-white text-green-600 w-8 h-8 flex items-center justify-center rounded-full font-semibold">
                  <span>{statusCounts.tem}</span>
                </div>
              </RenderWhen>

              {/* <div className="w-8 h-8 text-black/50 bg-white rounded-full flex items-center justify-center font-bold ">
                {totalItems}
              </div> */}
            </div>

            <div className="w-[1px] h-[1rem] bg-white/50" />

            <CreateItemButton category={category} items={items} />
          </div>
        </div>
      </button>

      <div
        className={`transition-all duration-300 ease-in-out ${
          isOpen
            ? "max-h-[10000px] opacity-100"
            : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <RenderWhen
          isTrue={items && items.length > 0}
          elseElement={<EmptyState />}
        >
          <div className="divide-y divide-gray-200">
            {items.map((item: Product) => (
              <ProductCard
                key={item.id}
                item={item}
                status={item.statusCompra}
                colorId={category.colorId}
              />
            ))}
          </div>
        </RenderWhen>
      </div>

      <AlertDialog
        isOpen={isActionDialogOpen}
        onClose={() => setIsActionDialogOpen(false)}
        title="Ações da Categoria"
        description={`O que você deseja fazer com a categoria "${category.name}"?`}
        variant="info"
        actions={[
          {
            label: "Editar",
            onClick: handleEdit,
            variant: "default",
            autoClose: true,
          },
          {
            label: "Excluir",
            onClick: handleDeleteClick,
            variant: "danger",
            autoClose: true,
          },
          {
            label: "Cancelar",
            onClick: () => null,
            variant: "secondary",
            autoClose: true,
          },
        ]}
      />

      <CreateCategoryModal
        isModalOpen={isEditModalOpen}
        categoryToEdit={category}
        onCloseModal={() => setIsEditModalOpen(false)}
      />

      <AlertDialog
        isOpen={isDeleteAlertOpen}
        onClose={() => setIsDeleteAlertOpen(false)}
        title="Excluir categoria?"
        description={`Tem certeza que deseja excluir a categoria "${category.name}"? Esta ação não pode ser desfeita e todos os produtos desta categoria também serão afetados.`}
        variant="danger"
        actions={[
          {
            label: "Cancelar",
            onClick: () => null,
            variant: "secondary",
            autoClose: true,
          },
          {
            label: "Excluir",
            onClick: confirmDelete,
            variant: "danger",
            autoClose: true,
          },
        ]}
      />
    </div>
  );
}
