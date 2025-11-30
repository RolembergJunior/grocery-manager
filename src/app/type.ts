import { JSX } from "react";

export enum STATUSPRODUCT {
  NEED_SHOPPING = 1,
  ALMOST_EMPTY = 2,
  COMPLETED = 3,
}
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
  subscriptionStatus: "free" | "premium" | "trial" | "pro";
  subscriptionTier?: "monthly" | "yearly";
  subscriptionStartDate?: string;
  subscriptionEndDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  currentQuantity: number;
  neededQuantity: number;
  unit: string;
  category: string;
  observation: string;
  statusCompra: STATUSPRODUCT;
  isRemoved: number;
  userId: string;
  reccurency: number | null;
  checked?: boolean;
  createdAt: string;
  updatedAt: string;
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
  resetAt: string;
  isRemoved: boolean;
  userId: string;
  itemId: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ListItem {
  id: string;
  name: string;
  listId: string;
  itemId: string | null;
  category: string;
  neededQuantity: number;
  boughtQuantity: number;
  unit: string;
  observation: string | null;
  checked: boolean;
  isRemoved: boolean;
  fromList: "inventory" | "created";
  userId: string;
  createdAt: string;
  updatedAt: string;
}
