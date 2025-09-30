import RenderWhen from "@/components/RenderWhen";
import Category from "../Category";
import { Item } from "@/app/type";
import { EmptyState } from "./components/EmptyState";

export default function List({
  products,
}: {
  products: Item[];
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
