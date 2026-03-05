import { Plus, ChevronDown, MoreVertical } from "lucide-react";

export default function MockupCategoryCard() {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-br from-amber-400 to-orange-500 w-full p-2 flex flex-col gap-2 items-center justify-between">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            <ChevronDown className="w-6 h-6 text-white -rotate-90" />

            <h3 className="text-white text-xl font-bold capitalize">Frutas</h3>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div className="bg-white text-green-600 w-8 h-8 flex items-center justify-center rounded-full font-semibold">
                <span>1</span>
              </div>
            </div>

            <div className="w-[1px] h-[1rem] bg-white/50" />

            <div className="relative">
              <div className="w-10 h-10 bg-white/30 rounded-full flex items-center justify-center font-bold text-lg shadow-lg ring-4 ring-white/50 animate-pulse">
                <Plus className="w-5 h-5 text-white" />
              </div>
            </div>

            <div className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-all duration-200">
              <MoreVertical className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
