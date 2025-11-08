"use client";

import AddNewItemForm from "@/components/AddNewItemForm";
import Modal from "@/components/Modal";
import { Category } from "@/app/type";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function CreateItemButton({ category }: { category: Category }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        className="w-10 h-10 bg-white/30 rounded-full flex items-center justify-center font-bold text-lg shadow-lg cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        <Plus className="w-5 h-5 text-white" />
      </div>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Adicionar Item"
      >
        <AddNewItemForm category={category} />
      </Modal>
    </>
  );
}
