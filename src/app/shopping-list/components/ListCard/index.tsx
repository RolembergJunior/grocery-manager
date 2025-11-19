"use client";

import { List, ListItem } from "@/app/type";
import { useState, useRef } from "react";
import { List as ListIcon, Plus, ShoppingCart } from "lucide-react";
import RenderWhen from "@/components/RenderWhen";
import { useRouter } from "next/navigation";
import ListItemCard from "../ListItemCard";
import { toast } from "sonner";
import { useList } from "@/hooks/use-list";
import { updateItem, deleteItem } from "@/services/list-manager";
import AlertDialog from "@/components/AlertDialog";
import CreateListModal from "@/components/ListSection/components/CreateListModal";
import { deleteList } from "@/services/lists";
import { deleteItemsByListId } from "@/services/list-items";
import { useSetAtom } from "jotai";
import { listsAtom } from "@/lib/atoms";

interface ListCardProps {
  list: List;
  onAddItem?: () => void;
}

export default function ListCard({ list, onAddItem }: ListCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteListAlertOpen, setIsDeleteListAlertOpen] = useState(false);

  const setLists = useSetAtom(listsAtom);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isLongPressRef = useRef(false);

  const { items } = useList(list.id);

  const router = useRouter();

  const checkedCount = items.filter((item) => item.checked).length;
  const totalCount = items.length;

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
      setIsExpanded(!isExpanded);
    }
    isLongPressRef.current = false;
  }

  function handleNavigateToList() {
    router.push(`/shopping-list/list?id=${list.id}`);
  }

  function handleToggleExpand() {
    setIsExpanded(!isExpanded);
  }

  function handleEdit() {
    setIsEditModalOpen(true);
  }

  function handleDeleteListClick() {
    setIsDeleteListAlertOpen(true);
  }

  function confirmDeleteList() {
    toast.promise(
      async () => {
        await Promise.all([deleteList(list.id), deleteItemsByListId(list.id)]);
      },
      {
        loading: "Excluindo lista...",
        success: () => {
          setLists((prev) => prev.filter((l) => l.id !== list.id));
          return "Lista excluída com sucesso!";
        },
        error: "Erro ao excluir lista. Tente novamente.",
      }
    );
  }

  function handleSaveItem(item: ListItem) {
    toast.promise(
      updateItem(list.id, item.id, {
        neededQuantity: item.neededQuantity,
        observation: item.observation,
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
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden transition-all hover:shadow-md active:scale-95">
      <button
        onClick={handleCardClick}
        onMouseLeave={handleLongPressEnd}
        onTouchStart={handleLongPressStart}
        onTouchEnd={handleLongPressEnd}
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

      <AlertDialog
        isOpen={isActionDialogOpen}
        onClose={() => setIsActionDialogOpen(false)}
        title="Ações da Lista"
        description={`O que você deseja fazer com a lista "${list.name}"?`}
        variant="info"
        actions={[
          {
            label: "Editar",
            onClick: handleEdit,
            variant: "primary",
            autoClose: true,
          },
          {
            label: "Excluir",
            onClick: handleDeleteListClick,
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

      <CreateListModal
        isModalOpen={isEditModalOpen}
        listToEdit={list}
        onCloseModal={() => setIsEditModalOpen(false)}
      />

      <AlertDialog
        isOpen={isDeleteListAlertOpen}
        onClose={() => setIsDeleteListAlertOpen(false)}
        title="Excluir lista?"
        description={`Tem certeza que deseja excluir a lista "${list.name}"? Esta ação não pode ser desfeita e todos os itens desta lista também serão removidos.`}
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
            onClick: confirmDeleteList,
            variant: "danger",
            autoClose: true,
          },
        ]}
      />
    </div>
  );
}
