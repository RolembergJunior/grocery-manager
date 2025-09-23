import { Item, Products } from "./type";

export const categoryOptions = [
  { value: "fridge", label: "Geladeira" },
  { value: "cupboard", label: "Armário" },
  { value: "freezer", label: "Congelador" },
  { value: "pantry", label: "Despensa" },
  { value: "produce", label: "Hortifrúti" },
  { value: "dairy", label: "Lácteos" },
  { value: "meat", label: "Carnes" },
  { value: "cleaning", label: "Limpeza" },
  { value: "personal-hygiene", label: "Higiene Pessoal" },
  { value: "other", label: "Outro" },
];

export const unitOptions = [
  { value: "pcs", label: "Unidade" },
  { value: "kg", label: "Kilogramas" },
  { value: "g", label: "Gramas" },
  { value: "l", label: "Litros" },
  { value: "ml", label: "Mililitros" },
  { value: "lbs", label: "Libras" },
  { value: "oz", label: "Onças" },
  { value: "cups", label: "Xícaras" },
  { value: "spoons", label: "Colheres" },
];

export function calculateStatistics(products: Products): {
  totalItems: number;
  needsShopping: number;
  totalCategories: number;
} {
  if (!products.length)
    return { totalItems: 0, needsShopping: 0, totalCategories: 0 };

  const totalItems = products.length;
  const needsShopping = products.filter(
    (item) => item.neededQuantity > 0
  ).length;
  const totalCategories = new Set(products.map((i) => i.category)).size;

  return { totalItems, needsShopping, totalCategories };
}

export function getAllItems(products: Products): Item[] {
  return [...products].sort((a: Item, b: Item) => {
    const statusOrder: { [key: string]: number } = {
      "needs-shopping": 0,
      "almost-empty": 1,
      full: 2,
    };
    const statusA = getItemStatus(a);
    const statusB = getItemStatus(b);

    if (statusOrder[statusA] !== statusOrder[statusB]) {
      return statusOrder[statusA] - statusOrder[statusB];
    }

    return a.name.localeCompare(b.name);
  });
}

function getItemStatus(item: Item): string {
  if (item.neededQuantity > 0) {
    return "needs-shopping";
  } else if (item.currentQuantity <= 2 && item.currentQuantity > 0) {
    return "almost-empty";
  } else if (item.currentQuantity > 2) {
    return "full";
  } else {
    return "needs-shopping";
  }
}

export function getCategories(
  products: Products
): { value: string; label: string }[] {
  return products.reduce((acc, item: Item) => {
    if (!acc.some((c) => c.value === item.category)) {
      acc.push({
        value: item.category,
        label: getCategoryName(item.category),
      });
    }

    return acc;
  }, [] as { value: string; label: string }[]);
}

export function getCategoryName(category: string): string {
  return (
    categoryOptions.find((c) => c.value === category?.toLowerCase())?.label ||
    category
  );
}

export function getUnitName(unit: string): string {
  return (
    unitOptions.find((c) => c.value === unit?.toLowerCase())?.label || unit
  );
}
