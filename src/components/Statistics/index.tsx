import { List, Package, ShoppingCart } from "lucide-react";

type StatisticCardProps = {
  value: number;
  label: string;
};

function StatisticCard({ value, label }: StatisticCardProps) {
  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100 hover:shadow-lg transition-all duration-300 cursor-pointer group">
      <div className="flex items-center justify-between">
        <div className="text-center flex-1">
          <div className="text-4xl font-black text-slate-800 mb-2 group-hover:text-amber-600 transition-colors">
            {value}
          </div>
          <div className="text-sm font-medium text-slate-600 uppercase tracking-wider">
            {label}
          </div>
        </div>
        <ShoppingCart className="w-8 h-8 text-amber-400 group-hover:text-amber-600 transition-colors" />
      </div>
    </div>
  );
}

type StatisticsProps = {
  totalItems: number;
  needsShopping: number;
  totalCategories: number;
};

function Statistics({
  totalItems,
  needsShopping,
  totalCategories,
}: StatisticsProps) {
  return (
    <div className="space-y-4">
      {/* Total Items Card */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 hover:shadow-lg transition-all duration-300 cursor-pointer group">
        <div className="flex items-center justify-between">
          <div className="text-center flex-1">
            <div className="text-4xl font-black text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">
              {totalItems}
            </div>
            <div className="text-sm font-medium text-slate-600 uppercase tracking-wider">
              Total de Itens
            </div>
          </div>
          <Package className="w-8 h-8 text-indigo-400 group-hover:text-indigo-600 transition-colors" />
        </div>
      </div>

      {/* Needs Shopping Card */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100 hover:shadow-lg transition-all duration-300 cursor-pointer group">
        <div className="flex items-center justify-between">
          <div className="text-center flex-1">
            <div className="text-4xl font-black text-slate-800 mb-2 group-hover:text-amber-600 transition-colors">
              {needsShopping}
            </div>
            <div className="text-sm font-medium text-slate-600 uppercase tracking-wider">
              Precisa comprar
            </div>
          </div>
          <ShoppingCart className="w-8 h-8 text-amber-400 group-hover:text-amber-600 transition-colors" />
        </div>
      </div>

      {/* Categories Card */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100 hover:shadow-lg transition-all duration-300 cursor-pointer group">
        <div className="flex items-center justify-between">
          <div className="text-center flex-1">
            <div className="text-4xl font-black text-slate-800 mb-2 group-hover:text-emerald-600 transition-colors">
              {totalCategories}
            </div>
            <div className="text-sm font-medium text-slate-600 uppercase tracking-wider">
              Categorias
            </div>
          </div>
          <List className="w-8 h-8 text-emerald-400 group-hover:text-emerald-600 transition-colors" />
        </div>
      </div>
    </div>
  );
}

export default Statistics;
