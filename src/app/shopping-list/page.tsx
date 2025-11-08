"use client";

import React from "react";
import { ShoppingCart, Package } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ShoppingListApp() {
  const router = useRouter();

  function handleSelectListType(type: string) {
    router.push(`/shopping-list/list?type=${type}`);
  }

  return (
    <div className="bg-gray-50 px-4 py-10">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Lista de Compras
          </h1>
          <p className="text-gray-600">Escolha como deseja criar sua lista</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div
            onClick={() => handleSelectListType("standalone")}
            className="bg-white rounded-xl p-6 shadow-lg border-2 border-transparent hover:border-blue-500 hover:shadow-xl transition-all duration-300 cursor-pointer group"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                <ShoppingCart className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Lista Avulsa
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Crie uma lista vazia e adicione manualmente os itens que deseja
                comprar. Ideal para compras específicas ou quando você quer
                total controle sobre a lista.
              </p>
            </div>
          </div>

          <div
            onClick={() => handleSelectListType("inventory-based")}
            className="bg-white rounded-xl p-6 shadow-lg border-2 border-transparent hover:border-green-500 hover:shadow-xl transition-all duration-300 cursor-pointer group"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                <Package className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Lista Baseada no Estoque
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Lista automaticamente preenchida com itens que precisam ser
                repostos. Baseada no seu estoque atual e nas quantidades
                necessárias.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Você pode voltar a esta tela a qualquer momento para trocar o tipo
            de lista
          </p>
        </div>
      </div>
    </div>
  );
}
