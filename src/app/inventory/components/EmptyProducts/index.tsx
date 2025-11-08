import { Package } from "lucide-react";

export default function EmptyProducts() {
  return (
    <div className="w-full flex justify-center">
      <div className="text-center py-16 text-gray-500">
        <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <h3 className="text-lg font-semibold mb-2">
          Nenhum produto cadastrado
        </h3>
        <p>Adicione seu primeiro produto para ver ele na lista!</p>
      </div>
    </div>
  );
}
