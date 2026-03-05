import { FolderOpen } from "lucide-react";
import HighlightPointer from "./HighlightPointer";
import MockupCard from "./MockupCard";
import MockupInventoryControls from "./mockups/MockupInventoryControls";
import MockupCategoryModal from "./mockups/MockupCategoryModal";
import { Button } from "@/components/ui/button";

interface VisualCategoryStepProps {
  onNext: () => void;
  onPrevious: () => void;
  onSkip: () => void;
}

export default function VisualCategoryStep({
  onNext,
  onPrevious,
  onSkip,
}: VisualCategoryStepProps) {
  return (
    <div className="flex flex-col py-6">
      <div className="text-center mb-6">
        <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mb-4 mx-auto shadow-lg">
          <FolderOpen className="w-10 h-10 text-white" />
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Organize com Categorias 📦
        </h2>

        <p className="text-gray-600 max-w-md mx-auto mb-6">
          Categorias ajudam você a organizar seus produtos. Exemplos: Frutas,
          Laticínios, Limpeza, Bebidas.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <p className="font-semibold text-gray-900 mb-3">
            1️⃣ Vá até a página "Inventário" e clique no botão +:
          </p>
          <MockupCard highlight>
            <MockupInventoryControls />
            <div className="flex justify-end mt-3">
              <HighlightPointer position="top" text="Clique aqui!" />
            </div>
          </MockupCard>
        </div>

        <div>
          <p className="font-semibold text-gray-900 mb-3">
            2️⃣ Preencha os dados da categoria:
          </p>
          <MockupCard>
            <MockupCategoryModal />
            <div className="mt-4 space-y-2 text-sm text-gray-600 bg-blue/5 p-3 rounded-lg">
              <div className="flex items-start gap-2">
                <span className="font-semibold min-w-[100px]">Nome:</span>
                <span>
                  Escolha um nome que represente o grupo de produtos (ex:
                  Frutas, Laticínios, Limpeza)
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-semibold min-w-[100px]">Cor:</span>
                <span>
                  Selecione uma cor para identificar visualmente a categoria
                </span>
              </div>
            </div>
          </MockupCard>
        </div>

        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 p-4 rounded-xl">
          <p className="text-sm text-gray-700 text-center">
            💡 <strong>Dica:</strong> Após finalizar o tutorial, vá em
            "Inventário" e crie suas categorias de verdade! Você pode criar
            quantas quiser.
          </p>
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <Button
          onClick={onPrevious}
          variant="outline"
          className="flex-1 px-6 py-3"
        >
          Anterior
        </Button>
        <Button onClick={onNext} className="flex-1 px-6 py-3">
          Próximo
        </Button>
      </div>

      <button
        onClick={onSkip}
        className="mt-3 text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
      >
        Pular Tutorial
      </button>
    </div>
  );
}
