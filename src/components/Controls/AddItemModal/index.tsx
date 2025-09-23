"use client";

import { Plus } from "lucide-react";
import Modal from "../../Modal";
import AddNewItemForm from "../../AddNewItemForm";
import { useState } from "react";
import RenderWhen from "@/components/RenderWhen";

export default function AddItemButtonModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(!isModalOpen)}
        className={`p-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-sm hover:shadow-md transition-all duration-200 group flex items-center gap-2 font-medium ${
          isModalOpen ? "bg-blue-700" : ""
        }`}
        title="Adicionar novo produto"
      >
        <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
        <span className="hidden sm:inline">Adicionar</span>
      </button>

      <RenderWhen isTrue={isModalOpen}>
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Adicionar Produto"
          iconTitle={<Plus className="w-5 h-5 text-gray-600" />}
          size="lg"
        >
          <AddNewItemForm />
        </Modal>
      </RenderWhen>
    </>
  );
}
