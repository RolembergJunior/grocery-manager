"use client";

import { Check, Sparkles, Zap, Crown, X } from "lucide-react";
import RenderWhen from "../RenderWhen";
import Modal from "../Modal";
import { Button } from "../ui/button";

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    period: "por mês",
    description: "Perfeito para começar",
    icon: Sparkles,
    color: "blue",
    features: [
      // "Até 3 listas de compras",
      "Gerenciamento básico de produtos",
      "5 categorias",
      "Limitado a 30 produtos",
      "Responsividade mobile",
    ],
    limitations: [
      "Sem listas de compras",
      "Sem prioridades",
      "Sem rastreamento de recorrências",
    ],
    buttonText: "Plano atual",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "R$24,99",
    period: "por mês",
    description: "Para planejadores de supermercado sérios",
    icon: Zap,
    color: "purple",
    features: [
      "Até 5 listas de compras",
      "Gerenciamento avançado de produtos",
      "Categorias ilimitadas",
      "Rastreamento de prioridades",
      "Gerenciamento de recorrências",
      "Produtos ilimitados",
      "Exportar para PDF",
      "Suporte prioritário",
    ],
    limitations: [],
    buttonText: "Upgrade para Pro",
    highlighted: true,
  },
  {
    name: "Premium",
    price: "R$49,99",
    period: "por mês",
    description: "Para famílias e usuários com necessidades avançadas",
    icon: Crown,
    color: "amber",
    features: [
      "Tudo no Pro",
      "Compartilhamento familiar (até 5 membros)",
      "Integração de receitas",
      "Recomendações inteligentes de compra",
      "Análise de estoque",
      "Rastreamento de preços",
      "Planejamento de refeições",
      "Suporte Premium 24/7",
    ],
    limitations: [],
    buttonText: "Upgrade para Premium",
    highlighted: false,
  },
];

export default function PricingModal({ isOpen, onClose }: PricingModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Escolha o plano"
      size="xl"
      className="max-w-6xl"
    >
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Faça upgrade para desbloquear funcionalidades poderosas
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {pricingPlans.map((plan) => {
          const Icon = plan.icon;
          const isHighlighted = plan.highlighted;

          return (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-6 border-2 transition-all ${
                isHighlighted
                  ? "border-purple-500 shadow-xl scale-105"
                  : "border-gray-200 hover:border-gray-300 hover:shadow-lg"
              }`}
            >
              <RenderWhen isTrue={isHighlighted}>
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold rounded-full">
                  Mais popular
                </div>
              </RenderWhen>

              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
                  plan.color === "blue"
                    ? "bg-blue-100"
                    : plan.color === "purple"
                    ? "bg-purple-100"
                    : "bg-amber-100"
                }`}
              >
                <Icon
                  className={`w-6 h-6 ${
                    plan.color === "blue"
                      ? "text-blue-600"
                      : plan.color === "purple"
                      ? "text-purple-600"
                      : "text-amber-600"
                  }`}
                />
              </div>

              <h3 className="text-xl font-bold text-gray-800 mb-1">
                {plan.name}
              </h3>
              <p className="text-sm text-gray-600 mb-4">{plan.description}</p>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-gray-900">
                    {plan.price}
                  </span>
                  <span className="text-sm text-gray-600">/{plan.period}</span>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
                {plan.limitations.map((limitation, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <X className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-500">{limitation}</span>
                  </div>
                ))}
              </div>

              <Button
                disabled={plan.name === "Free"}
                variant={plan.name === "Free" ? "secondary" : "default"}
                className={`w-full ${
                  plan.name === "Free"
                    ? "cursor-not-allowed opacity-50"
                    : isHighlighted
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    : "bg-gray-900 hover:bg-gray-800"
                }`}
              >
                {plan.buttonText}
              </Button>
            </div>
          );
        })}
      </div>

      <div className="border-t border-gray-200 pt-4 mt-4 -mx-6 -mb-6 px-6 pb-6 bg-gray-50">
        <p className="text-center text-sm text-gray-600">
          Todos os planos incluem garantia de devolução de 7 dias • Cancele a
          qualquer momento • Sem taxas ocultas
        </p>
      </div>
    </Modal>
  );
}
