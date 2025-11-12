import InventoryListCard from "./components/InventoryListCard";
import UserListsSection from "./components/UserListsSection";

export default function ShoppingListApp() {
  return (
    <div className="min-h-screen bg-cream px-4 py-6 pb-20">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-3xl font-bold text-[var(--color-text-dark)]">
              Listas de Compras
            </h1>
          </div>
          <p className="text-[var(--color-text-gray)] text-base">
            Organize suas compras com listas personalizadas ou use a lista
            automática do estoque
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <h2 className="text-[var(--color-text-gray)] text-sm font-medium mb-2 px-1">
              Lista Automática
            </h2>
            <InventoryListCard />
          </div>

          <UserListsSection />
        </div>
      </div>
    </div>
  );
}
