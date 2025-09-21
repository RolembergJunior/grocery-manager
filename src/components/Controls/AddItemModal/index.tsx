"use client";

import { Plus } from "lucide-react";
import Modal from "../../Modal";
import AddNewItemForm from "../../AddNewItemForm";

type AddItemModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AddItemModal({ isOpen, onClose }: AddItemModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Adicionar Produto"
      iconTitle={<Plus className="w-5 h-5 text-gray-600" />}
      size="lg"
    >
      <AddNewItemForm />
    </Modal>
  );
}
