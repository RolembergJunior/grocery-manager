export interface Item {
  id: number;
  name: string;
  currentQuantity: number;
  neededQuantity: number;
  unit: string;
  category: string;
  observation?: string;
  boughtQuantity?: number;
  completed?: boolean;
}

export type Products = Item[];

export interface OptionsType {
  value: string | number | null;
  label: string | number | null;
}

export type ShoppingListType = "standalone" | "inventory-based";

export interface ShoppingListConfig {
  type: ShoppingListType;
  title: string;
}
