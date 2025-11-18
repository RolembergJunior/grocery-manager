"use client";

import { useAtomValue } from "jotai";
import { useEffect, useRef } from "react";
import { useSetAtom } from "jotai";
import { loadingAtom } from "@/lib/atoms/loading";
import { listItemsByIdAtom } from "@/lib/atoms";
import { loadList } from "@/services/list-manager";

interface UseListOptions {
  autoLoad?: boolean;
}

export function useList(listId: string, options?: UseListOptions) {
  const items = useAtomValue(listItemsByIdAtom(listId));

  const { autoLoad = false } = options || {};
  const hasLoadedRef = useRef(false);

  const setIsLoading = useSetAtom(loadingAtom);

  useEffect(() => {
    async function reloadList() {
      if (autoLoad && !hasLoadedRef.current) {
        setIsLoading({ isOpen: true, message: "Carregando lista..." });
        await loadList(listId);
        hasLoadedRef.current = true;
        setIsLoading({ isOpen: false, message: "" });
      }
    }
    reloadList();
  }, [listId, autoLoad]);

  return {
    items: items.filter((i) => !i.isRemoved),
  };
}
