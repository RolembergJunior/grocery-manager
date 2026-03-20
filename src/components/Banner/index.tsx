"use client";

import { Sparkles, AlertTriangle } from "lucide-react";
import { useState } from "react";
import PricingModal from "../PricingModal";
import { Button } from "../ui/button";
import { useSubscription } from "@/hooks/use-subscription";

export default function Banner() {
  const [showPricing, setShowPricing] = useState(false);
  const { isTrial, isFree, inGracePeriod, daysRemainingInGrace } =
    useSubscription();

  function renderBanner() {
    if (inGracePeriod) {
      return (
        <div className="mb-6 bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-300 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-800">
                  Seu plano expirou!
                </h3>
                <p className="text-xs text-gray-700">
                  Você tem{" "}
                  <span className="font-bold text-orange-600">
                    {daysRemainingInGrace}{" "}
                    {daysRemainingInGrace === 1 ? "dia" : "dias"} restantes
                  </span>{" "}
                  para fazer upgrade antes de perder o acesso aos recursos pro.
                </p>
              </div>
            </div>
            <Button
              onClick={() => setShowPricing(true)}
              size="sm"
              className="bg-orange-500 hover:bg-orange-600 text-white flex-shrink-0"
            >
              Fazer Upgrade
            </Button>
          </div>
        </div>
      );
    }

    if (isFree) {
      return (
        <div className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-800">
                  Plano FREE
                </h3>
                <p className="text-xs text-gray-600">
                  Seu plano foi alterado para FREE. Faça upgrade para acessar
                  recursos pro.
                </p>
              </div>
            </div>
            <Button
              onClick={() => setShowPricing(true)}
              size="sm"
              className="flex-shrink-0"
            >
              Fazer Upgrade
            </Button>
          </div>
        </div>
      );
    }

    if (isTrial) {
      return (
        <div className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-800">
                  Plano Experimental
                </h3>
                <p className="text-xs text-gray-600">
                  Este plano é uma experimentação de 3 meses!! Após esse período
                  serão disponibilizados os preços.
                </p>
              </div>
            </div>
            <Button
              onClick={() => setShowPricing(true)}
              size="sm"
              className="flex-shrink-0"
            >
              Ver Planos
            </Button>
          </div>
        </div>
      );
    }
  }

  return (
    <>
      {renderBanner()}
      <PricingModal
        isOpen={showPricing}
        onClose={() => setShowPricing(false)}
      />
    </>
  );
}
