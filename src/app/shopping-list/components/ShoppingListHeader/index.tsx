"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";
import RenderWhen from "@/components/RenderWhen";
import EditableListTitle from "./components/EditableListTitle";

interface ShoppingListHeaderProps {
  selectedListType: "standalone" | "inventory-based" | null;
  listTitle: string;
  onBackToSelection: () => void;
  onTitleChange: (newTitle: string) => void;
}

export default function ShoppingListHeader({
  selectedListType,
  listTitle,
  onBackToSelection,
  onTitleChange,
}: ShoppingListHeaderProps) {
  return (
    <div className="w-full px-4 pt-7">
      <div className="flex items-center w-full">
        <button
          onClick={onBackToSelection}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>

        <RenderWhen
          isTrue={selectedListType === "standalone"}
          elseElement={
            <h1 className="text-xl font-semibold text-gray-900 w-full">
              {listTitle}
            </h1>
          }
        >
          <EditableListTitle title={listTitle} onTitleChange={onTitleChange} />
        </RenderWhen>
      </div>
    </div>
  );
}
