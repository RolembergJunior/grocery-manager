"use client";

import { useRef, useState } from "react";
import { useAtomValue } from "jotai";
import { toast } from "sonner";
import { listItemsByIdAtom } from "@/lib/atoms";
import { completeList } from "@/services/list-manager";
import type { AlertAction } from "@/components/AlertDialog";

/**
 * Encapsulates the "finalize list" flow. Mirrors the mobile useCompleteList:
 * confirmAndComplete finalizes directly when everything is checked, otherwise it
 * asks for confirmation. The confirmation UI is declarative on web, so the hook
 * owns the dialog state and hands back the props to spread into <AlertDialog />.
 */
export function useCompleteList(listId: string) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const pendingOnDone = useRef<(() => void) | undefined>(undefined);

  const items = useAtomValue(listItemsByIdAtom(listId)).filter(
    (i) => !i.isRemoved,
  );
  const checkedCount = items.filter((i) => i.checked).length;
  const totalCount = items.length;

  function complete(onDone?: () => void) {
    toast.promise(completeList(listId), {
      loading: "Finalizando a lista...",
      success: () => {
        onDone?.();
        return "Lista finalizada com sucesso!";
      },
      error: "Erro ao finalizar lista. Tente novamente.",
    });
  }

  function confirmAndComplete(onDone?: () => void) {
    if (totalCount > 0 && checkedCount < totalCount) {
      pendingOnDone.current = onDone;
      setIsConfirmOpen(true);
      return;
    }
    complete(onDone);
  }

  const confirmDialog = {
    isOpen: isConfirmOpen,
    onClose: () => setIsConfirmOpen(false),
    title: `Existe(m) ${totalCount - checkedCount} item(ns) não marcado(s)`,
    description: "Deseja finalizar a lista mesmo assim?",
    variant: "warning" as const,
    actions: [
      {
        label: "NÃO",
        onClick: () => {},
        variant: "secondary",
        autoClose: true,
      },
      {
        label: "SIM",
        onClick: () => complete(pendingOnDone.current),
        variant: "default",
        autoClose: true,
      },
    ] as AlertAction[],
  };

  return { confirmAndComplete, confirmDialog, checkedCount, totalCount };
}
