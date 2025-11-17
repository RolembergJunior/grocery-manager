import { JSX } from "react";

export interface OptionsType {
  value: string | number | null;
  label: string | number | null | JSX.Element;
}

export type ShoppingListType = "standalone" | "inventory-based";

export interface ShoppingListConfig {
  type: ShoppingListType;
  title: string;
}

export interface Profile {
  name: string;
  email: string;
  nameApp: string;
  imagePath: string;
  createdAt: string; // ISO 8601: "YYYY-MM-DDTHH:mm:ss.sssZ"
  updatedAt: string; // ISO 8601: "YYYY-MM-DDTHH:mm:ss.sssZ"
}

export interface Product {
  id: string;
  name: string;
  currentQuantity: number;
  neededQuantity: number;
  unit: string;
  category: string;
  observation: string;
  statusCompra: number;
  isRemoved: number;
  userId: string;
  reccurency: number | null;
  checked?: boolean;
  createdAt: string; // ISO 8601: "YYYY-MM-DDTHH:mm:ss.sssZ"
  updatedAt: string; // ISO 8601: "YYYY-MM-DDTHH:mm:ss.sssZ"
}

export interface Category {
  id: string;
  name: string;
  colorId: number;
  isRemoved: boolean;
  userId: string;
}

export interface List {
  id: string;
  name: string;
  description: string;
  resetAt: string; // ISO 8601: "YYYY-MM-DDTHH:mm:ss.sssZ"
  isRemoved: boolean;
  userId: string;
  itemId: string[];
  createdAt: string; // ISO 8601: "YYYY-MM-DDTHH:mm:ss.sssZ"
  updatedAt: string; // ISO 8601: "YYYY-MM-DDTHH:mm:ss.sssZ"
}

export interface ListItem {
  id: string;
  name: string;
  listId: string;
  itemId: string | null; // ID do produto do inventário (quando fromList === "inventory")
  category: string;
  neededQuantity: number;
  boughtQuantity: number;
  unit: string;
  observation: string | null;
  checked: boolean;
  isRemoved: boolean;
  fromList: "inventory" | "created"; // Origem do item: inventário ou criado manualmente
  userId: string;
  createdAt: string; // ISO 8601: "YYYY-MM-DDTHH:mm:ss.sssZ"
  updatedAt: string; // ISO 8601: "YYYY-MM-DDTHH:mm:ss.sssZ"
}
