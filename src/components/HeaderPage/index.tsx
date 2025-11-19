import React from "react";
import RenderWhen from "../RenderWhen";
import { ShoppingCart } from "lucide-react";

export default function HeaderPage({ hasNameApp }: { hasNameApp?: boolean }) {
  return (
    <>
      <RenderWhen isTrue={hasNameApp}>
        <div className="flex items-center gap-2 mb-6">
          <div className="w-12 h-12 bg-[var(--color-stats-card)] rounded-full flex items-center justify-center">
            <div className="w-10 h-10 bg-[var(--color-header-blue)] rounded-full flex items-center justify-center">
              <ShoppingCart color="white" />
            </div>
          </div>
          <h1 className="text-2xl font-semibold text-[var(--color-text-gray)]">
            Grocery
          </h1>
        </div>
      </RenderWhen>

      <div className="bg-[var(--color-header-blue)] rounded-3xl p-6 mb-6 relative shadow-md">
        <h2 className="text-white text-2xl font-semibold mb-1">Casa Divó</h2>
        <p className="text-white/80 text-sm">
          Organize seus produtos por categoria e nunca esqueça o que precisa
          comprar!
        </p>
      </div>
    </>
  );
}
