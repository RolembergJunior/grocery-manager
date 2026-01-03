"use client";

import AddNewItemForm from "@/components/AddNewItemForm";
import Modal from "@/components/Modal";
import { Category, Product } from "@/app/type";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useSubscription } from "@/hooks/use-subscription";
import { toast } from "sonner";

export default function CreateItemButton({
  category,
  items,
}: {
  category: Category;
  items: Product[];
}) {
  const [isOpen, setIsOpen] = useState(false);

  const { isFree } = useSubscription();

  function handleOpenCreateItemModal() {
    if (isFree && items.length >= 30) {
      return toast.warning(
        "Seu plano não permite criar mais que 30 itens! Faça upgrade do seu plano atual para conseguir mais itens."
      );
    }

    setIsOpen(true);
  }

  return (
    <>
      <div
        className="w-10 h-10 bg-white/30 rounded-full flex items-center justify-center font-bold text-lg shadow-lg cursor-pointer z-50"
        onClick={handleOpenCreateItemModal}
      >
        <Plus className="w-5 h-5 text-white" />
      </div>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={`Adicionar Item (${category.name})`}
      >
        <AddNewItemForm category={category} />
      </Modal>
    </>
  );
}
