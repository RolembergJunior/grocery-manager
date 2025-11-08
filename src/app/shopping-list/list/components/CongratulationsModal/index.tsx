"use client";

import { Check, ShoppingBag } from "lucide-react";

interface CongratulationsModalProps {
  isOpen: boolean;
  onGoBack: () => void;
}

export default function CongratulationsModal({
  isOpen,
  onGoBack,
}: CongratulationsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-white bg-opacity-20 rounded-full p-4">
              <Check className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-2">Parabéns! 🎉</h2>
          <p className="text-green-100">
            Lista de compras finalizada com sucesso!
          </p>
        </div>

        {/* Content */}
        <div className="p-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="text-6xl">🛒✅</div>
          </div>
          <p className="text-gray-600 mb-6">
            Todos os itens foram coletados e seu inventário foi atualizado.
          </p>

          {/* Action button */}
          <button
            onClick={onGoBack}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-5 h-5" />
            Criar Nova Lista
          </button>
        </div>
      </div>
    </div>
  );
}
