import { PackageOpen } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <PackageOpen className="w-8 h-8 text-gray-400" />
      </div>
      <h4 className="text-lg font-semibold text-gray-700 mb-2">
        Nenhum produto nesta categoria
      </h4>
      <p className="text-sm text-gray-500 max-w-sm">
        Adicione produtos a esta categoria para começar a gerenciar seu estoque
      </p>
    </div>
  );
}
