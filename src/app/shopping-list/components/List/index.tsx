import RenderWhen from "@/components/RenderWhen";
import Category from "../Category";
import { Item } from "@/app/type";
import { EmptyState } from "./components/EmptyState";

export default function List({
  products,
  handleCheckProduct,
  updateBoughtQuantity,
  removeItem,
}: {
  products: Item[];
  handleCheckProduct: (id: number) => void;
  updateBoughtQuantity: (id: number, change: number) => void;
  removeItem: (id: number) => void;
}) {
  function groupedItems() {
    return products.reduce((groups: { [key: string]: Item[] }, item: Item) => {
      if (!groups[item.category]) {
        groups[item.category] = [];
      }
      groups[item.category].push(item);
      return groups;
    }, {});
  }

  return (
    <div className="px-4 mb-14 h-full ">
      <RenderWhen isTrue={products.length > 0} elseElement={<EmptyState />}>
        {Object.entries(groupedItems()).map(([category, categoryItems]) => (
          <Category
            key={category}
            category={category}
            categoryItems={categoryItems}
            handleCheckProduct={handleCheckProduct}
            updateBoughtQuantity={updateBoughtQuantity}
            removeItem={removeItem}
          />
        ))}
      </RenderWhen>
    </div>
  );
}
