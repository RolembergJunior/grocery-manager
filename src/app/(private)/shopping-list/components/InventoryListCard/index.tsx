"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useAtomValue } from "jotai";
import ListItemCard from "../ListItemCard";
import ExpandableListCard from "../ExpandableListCard";
import { useList } from "@/hooks/use-list";
import { useCompleteList } from "@/hooks/use-complete-list";
import { useToggleListItem } from "@/hooks/use-toggle-list-item";
import { deleteItem, updateItem } from "@/services/list-manager";
import { ListItem } from "@/app/type";
import AlertDialog from "@/components/AlertDialog";
import { categoriesAtom } from "@/lib/atoms";
import { INVENTORY_LIST_ID } from "@/lib/constants/lists";

export default function InventoryListCard() {
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const router = useRouter();

  const categories = useAtomValue(categoriesAtom);
  const { items } = useList(INVENTORY_LIST_ID, { autoLoad: true });
  const { onToggle } = useToggleListItem();
  const { confirmAndComplete, confirmDialog } =
    useCompleteList(INVENTORY_LIST_ID);

  function handleNavigateToInventoryList() {
    router.push(`/shopping-list/list?id=${INVENTORY_LIST_ID}`);
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
    <>
      <ExpandableListCard
        title="Lista do Estoque"
        subtitle="Gerada automaticamente"
        headerClassName="bg-gradient-to-br from-[var(--color-category-orange)] to-[var(--color-category-pink)]"
        items={items}
        categories={categories}
        onOpenFull={handleNavigateToInventoryList}
        onFinalize={() => confirmAndComplete()}
        emptyText="Nenhum item precisa ser reposto"
        emptySubtext="Seu inventário está completo!"
        renderItem={(item) => (
          <ListItemCard
            item={item}
            hasDeleteButton
            onSave={handleSaveItem}
            onDelete={handleDeleteInventoryItem}
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
    </>
  );
}
