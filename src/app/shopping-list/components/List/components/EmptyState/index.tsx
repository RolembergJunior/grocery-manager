import { ShoppingCart } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full py-12 text-center">
      <div className="mb-4 rounded-full bg-gray-100 p-4">
        <ShoppingCart className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900">
        Sua lista de compras está vazia
      </h3>
      <p className="mt-1 text-sm text-gray-500">
        Adicione itens à sua lista para começar
      </p>
    </div>
  );
}
