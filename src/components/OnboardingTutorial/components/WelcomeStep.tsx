import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface WelcomeStepProps {
  onNext: () => void;
  onSkip: () => void;
}

export default function WelcomeStep({ onNext, onSkip }: WelcomeStepProps) {
  return (
    <div className="flex flex-col items-center text-center py-8">
      <div className="w-24 h-24 bg-gradient-to-br from-blue to-purple-500 rounded-full flex items-center justify-center mb-6 shadow-lg">
        <Sparkles className="w-12 h-12 text-white" />
      </div>

      <h2 className="text-3xl font-bold text-gray-900 mb-4">
        Bem-vindo ao ListaAí! 🎉
      </h2>

      <p className="text-lg text-gray-600 max-w-md mb-8">
        Organize suas compras, nunca mais esqueça itens no mercado e mantenha
        controle total do seu estoque doméstico. Vamos começar?
      </p>

      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
        <Button
          onClick={onNext}
          className="flex-1 px-6 py-3 transition-all duration-200 shadow-md hover:shadow-lg"
        >
          Começar Tutorial
        </Button>
        <Button onClick={onSkip} variant="outline" className="flex-1 px-6 py-3">
          Pular
        </Button>
      </div>
    </div>
  );
}
