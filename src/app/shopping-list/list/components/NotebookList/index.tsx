"use client";

import type { ListItem } from "@/app/type";
import RenderWhen from "@/components/RenderWhen";
import { useState, useEffect } from "react";
import NotebookItem from "./components/NotebookItem";
import Controls from "./components/Controls";

interface NotebookListProps {
  items: ListItem[];
}

export default function NotebookList({ items }: NotebookListProps) {
  const [dataList, setDataList] = useState<ListItem[]>(items);

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
