import HeaderPage from "@/components/HeaderPage";
import CategorySection from "@/components/CategorySection";
import ListSection from "@/components/ListSection";

export default function GroceryHome() {
  return (
    <div className="min-h-dvh md:screen p-4 pb-20">
      <HeaderPage hasNameApp />

      {/* <h3 className="text-[var(--color-text-gray)] text-lg font-medium mb-3">
        Estatísticas
      </h3>
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-[var(--color-stats-card)] rounded-2xl h-20 shadow-sm"></div>
        <div className="bg-[var(--color-stats-card)] rounded-2xl h-20 shadow-sm"></div>
      </div> */}

      <CategorySection />

      <ListSection />
    </div>
  );
}
