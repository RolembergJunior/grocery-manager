import { Button } from "@/components/ui/button";
import { ClipboardList, CheckCircle2, Sparkles } from "lucide-react";

interface ListsStepProps {
  onFinish: () => void;
  onPrevious: () => void;
}

export default function ListsStep({ onFinish, onPrevious }: ListsStepProps) {
  return (
    <div className="flex flex-col py-6">
      <div className="text-center mb-6">
        <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center mb-4 mx-auto shadow-lg">
          <ClipboardList className="w-10 h-10 text-white" />
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Suas Listas de Compras 📝
        </h2>

        <p className="text-gray-600 max-w-md mx-auto mb-6">
          Agora que você já tem categorias e produtos, veja como funcionam as
          listas de compras!
        </p>
      </div>

      <div className="space-y-4 mb-6">
        <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-category-orange rounded-lg flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Lista Automática do Estoque
              </h3>
              <p className="text-sm text-gray-600">
                Gerada automaticamente com produtos que você marcou como
                "precisa comprar". Perfeita para compras semanais!
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-blue rounded-lg flex items-center justify-center flex-shrink-0">
              <ClipboardList className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Listas Personalizadas
              </h3>
              <p className="text-sm text-gray-600">
                Crie listas para ocasiões especiais como "Churrasco", "Festa" ou
                "Viagem". Adicione itens do estoque ou crie novos!
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Sincronização Automática
              </h3>
              <p className="text-sm text-gray-600">
                Ao marcar itens como comprados, seu estoque é atualizado
                automaticamente. Tudo sincronizado!
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 bg-blue/5 border border-blue/20 rounded-xl mb-6">
        <p className="text-sm text-gray-700 text-center">
          💡 <strong>Dica:</strong> Acesse a página "Listas de Compras" no menu
          para começar a usar suas listas agora mesmo!
        </p>
      </div>

      <div className="flex gap-3">
        <Button
          onClick={onPrevious}
          variant="outline"
          className="flex-1 px-6 py-3"
        >
          Anterior
        </Button>
        <Button
          onClick={onFinish}
          className="flex-1 px-6 py-3 text-white rounded-xl hover:opacity-90 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
        >
          Finalizar Tutorial ✨
        </Button>
      </div>
    </div>
  );
}
