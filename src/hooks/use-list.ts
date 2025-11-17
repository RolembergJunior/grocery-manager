"use client";

import { useAtomValue } from "jotai";
import { useEffect, useRef } from "react";
import { listItemsByIdAtom } from "@/lib/atoms";
import { loadList } from "@/services/list-manager";

interface UseListOptions {
  autoLoad?: boolean;
}

export function useList(listId: string, options?: UseListOptions) {
  const items = useAtomValue(listItemsByIdAtom(listId));

  const { autoLoad = false } = options || {};
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    async function reloadList() {
      if (autoLoad && !hasLoadedRef.current) {
        await loadList(listId);
        hasLoadedRef.current = true;
      }
    }
    reloadList();
  }, [listId, autoLoad]);

  return {
    items,
  };
}
