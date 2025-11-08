"use client";

import type { ListItem } from "@/app/type";
import RenderWhen from "@/components/RenderWhen";
import { useState, useEffect } from "react";
import NotebookItem from "./components/NotebookItem";
import Controls from "./components/Controls";

interface NotebookListProps {
  items: ListItem[];
}

// Test data array with 20 items
const TEST_DATA: ListItem[] = [
  {
    id: "1",
    name: "Arroz",
    listId: "test-list",
    itemId: [],
    category: "Grãos",
    neededQuantity: 2,
    unit: "kg",
    observation:
      "Tentar comprar arro da marca prato finao!! Se não conseguir pode comprar do tio João!!",
    checked: false,
    isRemoved: false,
    userId: "test-user",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    name: "Feijão",
    listId: "test-list",
    itemId: [],
    category: "Grãos",
    neededQuantity: 1,
    unit: "kg",
    observation: null,
    checked: false,
    isRemoved: false,
    userId: "test-user",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    name: "Macarrão",
    listId: "test-list",
    itemId: [],
    category: "Massas",
    neededQuantity: 3,
    unit: "pacote",
    observation: null,
    checked: true,
    isRemoved: false,
    userId: "test-user",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "4",
    name: "Tomate",
    listId: "test-list",
    itemId: [],
    category: "Legumes",
    neededQuantity: 5,
    unit: "unidade",
    observation: null,
    checked: false,
    isRemoved: false,
    userId: "test-user",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "5",
    name: "Cebola",
    listId: "test-list",
    itemId: [],
    category: "Legumes",
    neededQuantity: 3,
    unit: "unidade",
    observation: null,
    checked: false,
    isRemoved: false,
    userId: "test-user",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "6",
    name: "Leite",
    listId: "test-list",
    itemId: [],
    category: "Laticínios",
    neededQuantity: 2,
    unit: "litro",
    observation: null,
    checked: true,
    isRemoved: false,
    userId: "test-user",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "7",
    name: "Queijo",
    listId: "test-list",
    itemId: [],
    category: "Laticínios",
    neededQuantity: 500,
    unit: "g",
    observation: null,
    checked: false,
    isRemoved: false,
    userId: "test-user",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "8",
    name: "Pão",
    listId: "test-list",
    itemId: [],
    category: "Padaria",
    neededQuantity: 2,
    unit: "unidade",
    observation: null,
    checked: false,
    isRemoved: false,
    userId: "test-user",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "9",
    name: "Manteiga",
    listId: "test-list",
    itemId: [],
    category: "Laticínios",
    neededQuantity: 1,
    unit: "pote",
    observation: null,
    checked: true,
    isRemoved: false,
    userId: "test-user",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "10",
    name: "Café",
    listId: "test-list",
    itemId: [],
    category: "Bebidas",
    neededQuantity: 500,
    unit: "g",
    observation: null,
    checked: false,
    isRemoved: false,
    userId: "test-user",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "11",
    name: "Açúcar",
    listId: "test-list",
    itemId: [],
    category: "Condimentos",
    neededQuantity: 1,
    unit: "kg",
    observation: null,
    checked: false,
    isRemoved: false,
    userId: "test-user",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "12",
    name: "Sal",
    listId: "test-list",
    itemId: [],
    category: "Condimentos",
    neededQuantity: 1,
    unit: "kg",
    observation: null,
    checked: true,
    isRemoved: false,
    userId: "test-user",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "13",
    name: "Óleo",
    listId: "test-list",
    itemId: [],
    category: "Condimentos",
    neededQuantity: 900,
    unit: "ml",
    observation: null,
    checked: false,
    isRemoved: false,
    userId: "test-user",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "14",
    name: "Alho",
    listId: "test-list",
    itemId: [],
    category: "Temperos",
    neededQuantity: 2,
    unit: "unidade",
    observation: null,
    checked: false,
    isRemoved: false,
    userId: "test-user",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "15",
    name: "Batata",
    listId: "test-list",
    itemId: [],
    category: "Legumes",
    neededQuantity: 2,
    unit: "kg",
    observation: null,
    checked: false,
    isRemoved: false,
    userId: "test-user",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "16",
    name: "Cenoura",
    listId: "test-list",
    itemId: [],
    category: "Legumes",
    neededQuantity: 1,
    unit: "kg",
    observation: null,
    checked: true,
    isRemoved: false,
    userId: "test-user",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "17",
    name: "Frango",
    listId: "test-list",
    itemId: [],
    category: "Carnes",
    neededQuantity: 1,
    unit: "kg",
    observation: null,
    checked: false,
    isRemoved: false,
    userId: "test-user",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "18",
    name: "Carne Moída",
    listId: "test-list",
    itemId: [],
    category: "Carnes",
    neededQuantity: 500,
    unit: "g",
    observation: null,
    checked: false,
    isRemoved: false,
    userId: "test-user",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "19",
    name: "Banana",
    listId: "test-list",
    itemId: [],
    category: "Frutas",
    neededQuantity: 12,
    unit: "unidade",
    observation: null,
    checked: false,
    isRemoved: false,
    userId: "test-user",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "20",
    name: "Maçã",
    listId: "test-list",
    itemId: [],
    category: "Frutas",
    neededQuantity: 6,
    unit: "unidade",
    observation: null,
    checked: true,
    isRemoved: false,
    userId: "test-user",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default function NotebookList({ items }: NotebookListProps) {
  const [dataList, setDataList] = useState<ListItem[]>(TEST_DATA);

  // useEffect(() => {
  //   setDataList(items);
  // }, [items]);

  return (
    <div className="max-w-4xl mx-auto mt-2">
      <Controls products={dataList} onChangeData={setDataList} />

      <div className="absolute top-[14rem] left-0 right-0 h-12 flex items-center justify-center gap-4 z-50">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div className="w-5 h-14 notebook-binding-ring rounded-full" />
          </div>
        ))}
      </div>

      <div className="relative bg-white rounded-xl shadow-2xl notebook-paper mb-12">
        <div className="pt-10 pb-8 px-8 bg-white">
          <div className="space-y-4">
            <RenderWhen
              isTrue={!!dataList.length}
              elseElement={
                <div className="text-center py-12 text-[var(--color-text-gray)]">
                  <p className="text-lg">Nenhum item nesta lista</p>
                  <p className="text-sm mt-2">Adicione itens para começar</p>
                </div>
              }
            >
              {dataList.map((item) => (
                <NotebookItem key={item.id} item={item} />
              ))}
            </RenderWhen>
          </div>
        </div>
      </div>
    </div>
  );
}
