"use client";

import { List, ListItem } from "@/app/type";
import { useState } from "react";
import { List as ListIcon, Plus, ShoppingCart } from "lucide-react";
import RenderWhen from "@/components/RenderWhen";
import { useRouter } from "next/navigation";
import ListItemCard from "../ListItemCard";
import { toast } from "sonner";
import { useList } from "@/hooks/use-list";
import { updateItem, deleteItem } from "@/services/list-manager";
import AlertDialog from "@/components/AlertDialog";

interface ListCardProps {
  list: List;
  onAddItem?: () => void;
}

export default function ListCard({ list, onAddItem }: ListCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const { items } = useList(list.id);

  const router = useRouter();

  const checkedCount = items.filter((item) => item.checked).length;
  const totalCount = items.length;

  function handleNavigateToList() {
    router.push(`/shopping-list/list?id=${list.id}`);
  }

  function handleToggleExpand() {
    setIsExpanded(!isExpanded);
  }

  function handleSaveItem(item: ListItem) {
    toast.promise(
      updateItem(list.id, item.id, {
        neededQuantity: item.neededQuantity,
      }),
      {
        loading: "Salvando...",
        success: "Alterações salvas com sucesso!",
        error: "Erro ao salvar as alterações",
      }
    );
  }

  function handleDeleteItem(id: string) {
    setItemToDelete(id);
    setIsDeleteAlertOpen(true);
  }

  function confirmDeleteItem() {
    if (!itemToDelete) return;

    toast.promise(deleteItem(list.id, itemToDelete), {
      loading: "Removendo...",
      success: "Item removido da lista!",
      error: "Erro ao remover item",
    });

    setItemToDelete(null);
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden transition-all hover:shadow-md">
      <button
        onClick={handleToggleExpand}
        className="bg-[var(--color-blue)] w-full p-6 flex items-center justify-between transition-all cursor-pointer hover:opacity-90"
      >
        <div className="flex items-center gap-4 flex-1">
          <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
            <ListIcon className="w-6 h-6 text-white" />
          </div>

          <div className="text-left flex flex-col gap-2">
            <h3 className="text-white text-lg font-semibold">{list.name}</h3>
            <div className="inline-flex self-start bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full font-medium text-sm">
              {checkedCount}/{totalCount}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <RenderWhen isTrue={!!onAddItem}>
            <div
              onClick={(e) => {
                e.stopPropagation();
                onAddItem?.();
              }}
              className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-all duration-200 active:scale-95"
              title="Adicionar item à lista"
            >
              <Plus className="w-5 h-5" />
            </div>
          </RenderWhen>

          <div
            onClick={(e) => {
              e.stopPropagation();
              handleNavigateToList();
            }}
            className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-all duration-200 active:scale-95"
            title="Iniciar lista"
          >
            <ShoppingCart className="w-5 h-5" />
          </div>
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
          isTrue={items && items.length > 0}
          elseElement={
            <div className="p-8 text-center text-[var(--color-text-gray)]">
              <p className="text-base">Nenhum item nesta lista</p>
              <p className="text-sm mt-2 opacity-75">
                Adicione itens do inventário
              </p>
            </div>
          }
        >
          <div className="p-4 space-y-2">
            {items.map((item: ListItem) => (
              <ListItemCard
                key={item.id}
                item={item}
                hasDeleteButton
                onSave={handleSaveItem}
                onDelete={handleDeleteItem}
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
        description="Deseja realmente remover este item da lista?"
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
