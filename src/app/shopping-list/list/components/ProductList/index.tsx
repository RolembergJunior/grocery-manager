import RenderWhen from "@/components/RenderWhen";
import { Product } from "@/app/type";
import { EmptyState } from "./components/EmptyState";
import Category from "./components/Category";

export default function List({ products }: { products: Product[] }) {
  function groupedItems() {
    return products.reduce(
      (groups: { [key: string]: Product[] }, item: Product) => {
        if (!groups[item.category]) {
          groups[item.category] = [];
        }
        groups[item.category].push(item);
        return groups;
      },
      {}
    );
  }

  return (
    <div className="mb-14 h-full ">
      <RenderWhen isTrue={products.length > 0} elseElement={<EmptyState />}>
        {Object.entries(groupedItems()).map(([category, categoryItems]) => (
          <Category
            key={category}
            category={category}
            categoryItems={categoryItems}
          />
        ))}
      </RenderWhen>
    </div>
  );
}
