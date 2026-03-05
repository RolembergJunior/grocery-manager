import { Plus, Search, Filter } from "lucide-react";

export default function MockupInventoryControls() {
  return (
    <div className="flex justify-between items-center my-4 w-full gap-2 p-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 shadow-sm">
      <div className="relative w-full">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar produtos..."
          disabled
          className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-gray-200 shadow-sm focus:shadow-md text-gray-800 placeholder-gray-400 transition-all duration-200 cursor-not-allowed"
        />
      </div>

      <button className="bg-white p-3 rounded-2xl border border-gray-200 cursor-not-allowed opacity-60">
        <Filter className="w-5 h-5 text-gray-600" />
      </button>

      <div className="relative">
        <button className="bg-blue p-3 rounded-2xl shadow-md ring-4 ring-blue/30 animate-pulse">
          <Plus color="white" className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
