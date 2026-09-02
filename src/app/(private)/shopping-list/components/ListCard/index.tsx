"use client";

import { List, ListItem } from "@/app/type";
import { useState } from "react";
import { Plus, MoreVertical } from "lucide-react";
import RenderWhen from "@/components/RenderWhen";
import { useRouter } from "next/navigation";
import ListItemCard from "../ListItemCard";
import ExpandableListCard from "../ExpandableListCard";
import { toast } from "sonner";
import { useList } from "@/hooks/use-list";
import { useCompleteList } from "@/hooks/use-complete-list";
import { useToggleListItem } from "@/hooks/use-toggle-list-item";
import { updateItem, deleteItem } from "@/services/list-manager";
import AlertDialog from "@/components/AlertDialog";
import CreateListModal from "@/components/ListSection/components/CreateListModal";
import { deleteList } from "@/services/lists";
import { deleteItemsByListId } from "@/services/list-items";
import { useSetAtom, useAtomValue } from "jotai";
import { listsAtom, categoriesAtom } from "@/lib/atoms";

interface ListCardProps {
  list: List;
  onAddItem?: () => void;
}

export default function ListCard({ list, onAddItem }: ListCardProps) {
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteListAlertOpen, setIsDeleteListAlertOpen] = useState(false);

  const setLists = useSetAtom(listsAtom);
  const categories = useAtomValue(categoriesAtom);

  const { items } = useList(list.id);
  const { onToggle } = useToggleListItem();
  const { confirmAndComplete, confirmDialog } = useCompleteList(list.id);

  const router = useRouter();

  function handleNavigateToList() {
    router.push(`/shopping-list/list?id=${list.id}`);
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
      },
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
      },
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

  const headerActions = (
    <>
      <RenderWhen isTrue={!!onAddItem}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddItem?.();
          }}
          className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-all duration-200 active:scale-95"
          title="Adicionar item à lista"
        >
          <Plus className="w-5 h-5" />
        </button>
      </RenderWhen>

      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsActionDialogOpen(true);
        }}
        className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-all duration-200 active:scale-95"
        title="Opções da lista"
      >
        <MoreVertical className="w-5 h-5" />
      </button>
    </>
  );

  return (
    <>
      <ExpandableListCard
        title={list.name}
        headerClassName="bg-[var(--color-blue)]"
        headerActions={headerActions}
        items={items}
        categories={categories}
        onOpenFull={handleNavigateToList}
        onFinalize={() => confirmAndComplete()}
        emptyText="Nenhum item nesta lista"
        emptySubtext="Adicione itens do inventário"
        renderItem={(item) => (
          <ListItemCard
            item={item}
            hasDeleteButton
            onSave={handleSaveItem}
            onDelete={handleDeleteItem}
            onToggleChecked={onToggle}
          />
        )}
      />

      <AlertDialog {...confirmDialog} />

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
            variant: "default",
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
    </>
  );
}
