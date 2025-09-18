import { Item, Products } from "../type";

export function handleData(
  itemId: number,
  shoppingData: Products,
  type: "check" | "quantity" | "remove",
  newQuantity?: number
) {
  const newData = { ...shoppingData };

  for (const categoryKey of Object.keys(shoppingData)) {
    const itemIndex = newData[categoryKey].findIndex(
      (item) => item.id === itemId
    );

    switch (type) {
      case "check":
        return (newData[categoryKey][itemIndex] =
          !newData[categoryKey][itemIndex]);

      case "quantity":
        return (newData[categoryKey][itemIndex].currentQuantity = newQuantity!);

      case "remove":
        return newData[categoryKey].splice(itemIndex, 1);
    }
  }

  return newData;
}

export function getFilteredData(
  shoppingData: Products,
  searchTerm: string,
  currentFilter: string
): { filteredData: Products; hasVisibleItems: boolean } {
  const filteredData = {};
  let hasVisibleItems = false;

  for (const [categoryKey, category] of Object.entries(shoppingData)) {
    const filteredItems = category.filter((item) => {
      const matchesSearch = item.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        currentFilter === "all" || currentFilter === categoryKey;
      return matchesSearch && matchesCategory;
    });

    if (filteredItems.length > 0) {
      filteredData[categoryKey] = filteredItems;
      hasVisibleItems = true;
    }
  }

  return { filteredData, hasVisibleItems };
}

export function getIconFromCategory(category: string): string {
  switch (category) {
    case "fruits":
      return "🍎";
    case "vegetables":
      return "🥕";
    case "dairy":
      return "🥛";
    case "meat":
      return "🥩";
    case "bakery":
      return "🍞";
    case "pantry":
      return "🥫";
    default:
      return "🛒";
  }
}

export function matchesSearchFilter(item: Item, searchTerm: string): boolean {
  return item.name.toLowerCase().includes(searchTerm.toLowerCase());
}

export function matchesCategoryFilter(
  item: Item,
  categoryFilter: string
): boolean {
  return categoryFilter === "" || item.category.includes(categoryFilter);
}

export function matchesStatusFilter(item: Item, statusFilter: string): boolean {
  switch (statusFilter) {
    case "comprados":
      return !!item.completed;
    case "pendentes":
      return !item.completed && !item.isRemoved;
    case "removidos":
      return !!item.isRemoved;
    default:
      return true;
  }
}
