import { useState, useCallback } from "react";

interface UseModalResult<T> {
  isOpen: boolean;
  editItem: T | null;
  openModal: (item?: T) => void;
  closeModal: () => void;
  setEditItem: (item: T | null) => void;
}

/**
 * Reusable hook for managing modal state
 * @param initialState - Optional initial state for the modal
 * @returns Modal state and control functions
 */
export function useModal<T = unknown>(initialState?: {
  isOpen: boolean;
  editItem: T | null;
}): UseModalResult<T> {
  const [isOpen, setIsOpen] = useState(initialState?.isOpen ?? false);
  const [editItem, setEditItem] = useState<T | null>(
    initialState?.editItem ?? null
  );

  const openModal = useCallback((item?: T) => {
    setIsOpen(true);
    if (item !== undefined) {
      setEditItem(item);
    }
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setEditItem(null);
  }, []);

  return {
    isOpen,
    editItem,
    openModal,
    closeModal,
    setEditItem,
  };
}
