"use client";

import Modal from "@/components/Modal";
import { User, UserPen } from "lucide-react";
import { User as FirebaseUser } from "firebase/auth";
import RenderWhen from "@/components/RenderWhen";

interface AccountModalProps {
  isModalOpen: boolean;
  onCloseModal: () => void;
  user: FirebaseUser | null;
}

export default function AccountModal({
  isModalOpen,
  onCloseModal,
  user,
}: AccountModalProps) {
  return (
    <Modal
      isOpen={isModalOpen}
      onClose={onCloseModal}
      title="Dados da conta"
      height="xl"
      iconTitle={<UserPen />}
    >
      <div className="space-y-4">
        <div className="flex justify-center mb-6">
          <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-4 border-blue-400">
            <RenderWhen
              isTrue={!!user?.photoURL}
              elseElement={<User className="w-16 h-16 text-gray-400" />}
            >
              <img
                src={user?.photoURL!}
                alt={user?.displayName || "Profile"}
                className="w-full h-full object-cover"
              />
            </RenderWhen>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-xs text-gray-500 mb-1">Nome</p>
            <p className="text-sm font-medium text-gray-800">
              {user?.displayName || "—"}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Email</p>
            <p className="text-sm font-medium text-gray-800">
              {user?.email || "—"}
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
}
