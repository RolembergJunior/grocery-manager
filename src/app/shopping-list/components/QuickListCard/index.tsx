"use client";

import { Zap, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function QuickListCard() {
  const router = useRouter();

  function handleNavigateToQuickList() {
    router.push(`/shopping-list/list?type=quick`);
  }

  return (
    <button
      onClick={handleNavigateToQuickList}
      className="w-full bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-sm p-6 flex items-center justify-between transition-all hover:shadow-md hover:scale-[1.02] active:scale-[0.98] group"
    >
      <div className="flex items-center gap-4">
        <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
          <Zap className="w-6 h-6 text-white" />
        </div>

        <div className="text-left">
          <h3 className="text-white text-lg font-semibold">Lista Rápida</h3>
          <p className="text-white/80 text-sm mt-0.5">
            Crie e marque itens rapidamente
          </p>
        </div>
      </div>

      <ChevronRight className="w-6 h-6 text-white group-hover:translate-x-1 transition-transform" />
    </button>
  );
}
