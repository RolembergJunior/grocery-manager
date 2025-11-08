import { Product } from "../type";

export function handleData(
  itemId: number,
  shoppingData: Product[],
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
  shoppingData: Product[],
  searchTerm: string,
  currentFilter: string
): { filteredData: Product[]; hasVisibleItems: boolean } {
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
