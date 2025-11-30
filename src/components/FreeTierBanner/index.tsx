"use client";

import { Sparkles } from "lucide-react";
import { useState } from "react";
import PricingModal from "../PricingModal";
import { Button } from "../ui/button";

export default function FreeTierBanner() {
  const [showPricing, setShowPricing] = useState(false);

  return (
    <>
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
          {/* <Button onClick={() => setShowPricing(true)} size="sm">
            Upgrade
          </Button> */}
        </div>
      </div>

      <PricingModal
        isOpen={showPricing}
        onClose={() => setShowPricing(false)}
      />
    </>
  );
}
