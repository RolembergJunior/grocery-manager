import { Product } from "./type";

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

export const buyStatusOptions = [
  { value: 1, label: "Precisa comprar" },
  { value: 2, label: "Quase acabando" },
  { value: 3, label: "Em estoque" },
];

export const palletColors = {
  1: {
    backgroundColor: "#EF702D",
    color: "white",
    borderColor: "#EF702D",
    hoverBackgroundColor: "#EF702D",
    hoverColor: "white",
    // Tailwind classes
    bgClass: "bg-[#EF702D]",
    textClass: "text-white",
    borderClass: "border-[#EF702D]",
    hoverBgClass: "hover:bg-[#EF702D]",
    hoverTextClass: "hover:text-white",
  },
  2: {
    backgroundColor: "#7298C7",
    color: "white",
    borderColor: "#7298C7",
    hoverBackgroundColor: "#7298C7",
    hoverColor: "white",
    // Tailwind classes
    bgClass: "bg-[#7298C7]",
    textClass: "text-white",
    borderClass: "border-[#7298C7]",
    hoverBgClass: "hover:bg-[#7298C7]",
    hoverTextClass: "hover:text-white",
  },
  3: {
    backgroundColor: "#E36887",
    color: "white",
    borderColor: "#E36887",
    hoverBackgroundColor: "#E36887",
    hoverColor: "white",
    // Tailwind classes
    bgClass: "bg-[#E36887]",
    textClass: "text-white",
    borderClass: "border-[#E36887]",
    hoverBgClass: "hover:bg-[#E36887]",
    hoverTextClass: "hover:text-white",
  },
  4: {
    backgroundColor: "#897E37",
    color: "white",
    borderColor: "#897E37",
    hoverBackgroundColor: "#897E37",
    hoverColor: "white",
    // Tailwind classes
    bgClass: "bg-[#897E37]",
    textClass: "text-[#E4D579]",
    borderClass: "border-[#897E37]",
    hoverBgClass: "hover:bg-[#897E37]",
    hoverTextClass: "hover:text-white",
  },
  5: {
    backgroundColor: "#FBE6C9",
    color: "white",
    borderColor: "#FBE6C9",
    hoverBackgroundColor: "#FBE6C9",
    hoverColor: "white",
    // Tailwind classes
    bgClass: "bg-[#FBE6C9]",
    textClass: "text-[#EF702D]",
    borderClass: "border-[#FBE6C9]",
    hoverBgClass: "hover:bg-[#FBE6C9]",
    hoverTextClass: "hover:text-white",
  },
  6: {
    backgroundColor: "#E4E8EB",
    color: "white",
    borderColor: "#E4E8EB",
    hoverBackgroundColor: "#E4E8EB",
    hoverColor: "white",
    // Tailwind classes
    bgClass: "bg-[#E4E8EB]",
    textClass: "text-[#6C7B8D]",
    borderClass: "border-[#E4E8EB]",
    hoverBgClass: "hover:bg-[#E4E8EB]",
    hoverTextClass: "hover:text-white",
  },
  7: {
    backgroundColor: "#F8DAD8",
    color: "white",
    borderColor: "#F8DAD8",
    hoverBackgroundColor: "#F8DAD8",
    hoverColor: "white",
    // Tailwind classes
    bgClass: "bg-[#F8DAD8]",
    textClass: "text-[#E36887]",
    borderClass: "border-[#F8DAD8]",
    hoverBgClass: "hover:bg-[#F8DAD8]",
    hoverTextClass: "hover:text-white",
  },
  8: {
    backgroundColor: "#E4D579",
    color: "white",
    borderColor: "#E4D579",
    hoverBackgroundColor: "#E4D579",
    hoverColor: "white",
    // Tailwind classes
    bgClass: "bg-[#E4D579]",
    textClass: "text-[#655C23]",
    borderClass: "border-[#E4D579]",
    hoverBgClass: "hover:bg-[#E4D579]",
    hoverTextClass: "hover:text-white",
  },
};

export function calculateStatistics(products: Product[]): {
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

export function getAllItems(products: Product[]): Product[] {
  return [...products].sort((a: Product, b: Product) => {
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

function getItemStatus(item: Product): string {
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

export function getUnitName(unit: string): string {
  return (
    unitOptions.find((c) => c.value === unit?.toLowerCase())?.label || unit
  );
}
