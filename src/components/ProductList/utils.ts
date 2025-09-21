import { Item, Products } from "../../app/type";

export function getItemStatus(item: Item): string {
  if (item.currentQuantity === 0) {
    return "needs-shopping";
  }
  if (item.currentQuantity > 0 && item.currentQuantity < item.neededQuantity) {
    return "almost-empty";
  }

  return "in-stock";
}

export function getSortedCategories(products: Products): string[] {
  const set = new Set(products.map((p) => p.category));
  return Array.from(set).sort();
}

export function getItemsByCategory(
  products: Products,
  category: string
): Item[] {
  return products.filter((p) => p.category === category);
}

export function getItemsToBuyCount(items: Item[]): number {
  return items.length
    ? items.filter((item) => getItemStatus(item) === "needs-shopping").length
    : 0;
}

export function getCategoryStats(items: Item[]) {
  const totalItems = items.length;
  const itemsToBuy = getItemsToBuyCount(items);

  return {
    totalItems,
    itemsToBuy,
    hasItemsToBuy: itemsToBuy > 0,
  };
}

export function filterItems(
  items: Item[],
  searchTerm: string,
  selectFilter: { [keyFilter: string]: string[] }
) {
  return items.filter((item) => {
    const matchesSearch = searchTerm
      ? item.name.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    const matchesSelectFilter = Object.entries(selectFilter).length
      ? Object.entries(selectFilter).some(([key, value]) =>
          value.length
            ? value.includes(item[key as keyof Item] as string)
            : true
        )
      : true;

    return matchesSearch && matchesSelectFilter;
  });
}
