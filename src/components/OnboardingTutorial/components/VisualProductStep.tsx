import { ShoppingCart } from "lucide-react";
import MockupCard from "./MockupCard";
import MockupCategoryCard from "./mockups/MockupCategoryCard";
import MockupProductForm from "./mockups/MockupProductForm";
import { Button } from "@/components/ui/button";

interface VisualProductStepProps {
  onNext: () => void;
  onPrevious: () => void;
  onSkip: () => void;
}

export default function VisualProductStep({
  onNext,
  onPrevious,
  onSkip,
}: VisualProductStepProps) {
  return (
    <div className="flex flex-col py-6">
      <div className="text-center mb-6">
        <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mb-4 mx-auto shadow-lg">
          <ShoppingCart className="w-10 h-10 text-white" />
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Adicione Produtos ao Estoque 🛒
        </h2>

        <p className="text-gray-600 max-w-md mx-auto mb-6">
          Produtos são os itens que você tem em casa. Configure quantidades,
          unidades e muito mais!
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <p className="font-semibold text-gray-900 mb-3">
            1️⃣ Dentro de uma categoria, clique no botão + para adicionar:
          </p>
          <MockupCard highlight>
            <MockupCategoryCard />
          </MockupCard>
        </div>

        <div>
          <p className="font-semibold text-gray-900 mb-3">
            2️⃣ Configure todos os detalhes do produto:
          </p>
          <MockupCard>
            <MockupProductForm />
            <div className="mt-4 space-y-3 text-sm text-gray-600 bg-green-50 p-4 rounded-lg">
              <div className="flex items-start gap-2">
                <span className="font-semibold text-green-800 min-w-[140px]">
                  📝 Nome do item:
                </span>
                <span>
                  O nome do produto (ex: Leite Integral, Arroz, Sabão em Pó)
                </span>
              </div>

              <div className="flex items-start gap-2">
                <span className="font-semibold text-green-800 min-w-[140px]">
                  📏 Unidade:
                </span>
                <span>
                  Como você mede esse produto (Litro, Kg, Unidade, Pacote,
                  Caixa, etc)
                </span>
              </div>

              <div className="flex items-start gap-2">
                <span className="font-semibold text-green-800 min-w-[140px]">
                  ✅ Status de compra:
                </span>
                <span>
                  Define se precisa comprar, está quase acabando ou se tem em
                  casa
                </span>
              </div>

              <div className="mt-4 p-3 bg-white rounded-lg border border-green-200">
                <p className="text-xs text-gray-600">
                  � <strong>Dica:</strong> Após adicionar o produto, você poderá
                  configurar as quantidades (quanto tem e quanto precisa)
                  diretamente no card do produto.
                </p>
              </div>
            </div>
          </MockupCard>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 p-4 rounded-xl">
          <p className="text-sm text-gray-700 text-center">
            💡 <strong>Dica:</strong> Você pode adicionar quantos produtos
            quiser em cada categoria. Configure tudo com calma depois do
            tutorial!
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
