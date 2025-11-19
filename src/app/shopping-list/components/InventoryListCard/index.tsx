"use client";

import { Package, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import RenderWhen from "@/components/RenderWhen";
import { toast } from "sonner";
import ListItemCard from "../ListItemCard";
import { useList } from "@/hooks/use-list";
import { deleteItem, updateItem } from "@/services/list-manager";
import { ListItem } from "@/app/type";
import AlertDialog from "@/components/AlertDialog";

export const INVENTORY_LIST_ID = "inventory-list";

export default function InventoryListCard() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const router = useRouter();

  const { items } = useList(INVENTORY_LIST_ID, { autoLoad: true });

  function handleNavigateToInventoryList() {
    router.push(`/shopping-list/list?id=${INVENTORY_LIST_ID}`);
  }

  function handleToggleExpand() {
    setIsExpanded(!isExpanded);
  }

  function handleSaveItem(item: ListItem) {
    toast.promise(updateItem(INVENTORY_LIST_ID, item.id, item), {
      loading: "Salvando...",
      success: "Alterações salvas com sucesso!",
      error: "Erro ao salvar as alterações",
    });
  }

  function handleDeleteInventoryItem(id: string) {
    setItemToDelete(id);
    setIsDeleteAlertOpen(true);
  }

  function confirmDeleteItem() {
    if (!itemToDelete) return;

    toast.promise(deleteItem(INVENTORY_LIST_ID, itemToDelete), {
      loading: "Removendo da lista...",
      success: "Item removido com sucesso!",
      error: "Erro ao remover o item",
    });

    setItemToDelete(null);
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden transition-all hover:shadow-md">
      <button
        onClick={handleToggleExpand}
        className="w-full bg-gradient-to-br from-[var(--color-category-orange)] to-[var(--color-category-pink)] p-6 flex items-center justify-between transition-all cursor-pointer hover:opacity-90"
      >
        <div className="flex items-center gap-4 flex-1">
          <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
            <Package className="w-6 h-6 text-white" />
          </div>

          <div className="flex flex-col gap-2">
            <div className="text-left">
              <h3 className="text-white text-lg font-semibold">
                Lista do Estoque
              </h3>
              <p className="text-white/80 text-sm mt-0.5">
                Gerada automaticamente
              </p>
            </div>

            <div className="inline-flex self-start bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full font-medium text-sm">
              {items.length} {items.length === 1 ? "item" : "itens"}
            </div>
          </div>
        </div>

        <div
          onClick={(e) => {
            e.stopPropagation();
            handleNavigateToInventoryList();
          }}
          className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-all duration-200 active:scale-95"
          title="Iniciar lista do estoque"
        >
          <ShoppingCart className="w-5 h-5" />
        </div>
      </button>

      <div
        className={`transition-all duration-300 ease-in-out ${
          isExpanded
            ? "max-h-[10000px] opacity-100"
            : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <RenderWhen
          isTrue={items.length > 0}
          elseElement={
            <div className="p-8 text-center text-[var(--color-text-gray)]">
              <p className="text-base">Nenhum item precisa ser reposto</p>
              <p className="text-sm mt-2 opacity-75">
                Seu inventário está completo!
              </p>
            </div>
          }
        >
          <div className="p-4 space-y-2">
            {items.map((item) => (
              <ListItemCard
                key={item.id}
                item={item}
                onSave={handleSaveItem}
                onDelete={handleDeleteInventoryItem}
                hasDeleteButton
              />
            ))}
          </div>
        </RenderWhen>
      </div>

      <AlertDialog
        isOpen={isDeleteAlertOpen}
        onClose={() => {
          setIsDeleteAlertOpen(false);
          setItemToDelete(null);
        }}
        title="Remover item da lista?"
        description="Deseja realmente remover este item da lista do estoque?"
        variant="danger"
        actions={[
          {
            label: "Cancelar",
            onClick: () => null,
            autoClose: true,
            variant: "secondary",
          },
          {
            label: "Remover",
            onClick: confirmDeleteItem,
            autoClose: true,
            variant: "danger",
          },
        ]}
      />
    </div>
  );
}
