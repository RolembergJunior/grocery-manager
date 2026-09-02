"use client";

import { toast } from "sonner";
import { updateItem } from "@/services/list-manager";
import type { ListItem } from "@/app/type";

/**
 * Toggle the checked state of a list item. Mirrors the mobile useToggleListItem:
 * the caller awaits onToggle so the checkbox can show a spinner while it runs.
 */
export function useToggleListItem() {
  async function onToggle(item: ListItem): Promise<void> {
    try {
      await updateItem(item.listId, item.id, { checked: !item.checked });
    } catch {
      toast.error("Erro ao atualizar item");
    }
  }

  return { onToggle };
}
