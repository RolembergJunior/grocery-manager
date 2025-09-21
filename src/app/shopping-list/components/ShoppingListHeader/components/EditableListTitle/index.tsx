"use client";

import React, { useState } from "react";
import { Edit2, Check, X } from "lucide-react";
import RenderWhen from "@/components/RenderWhen";

interface EditableListTitleProps {
  title: string;
  onTitleChange: (newTitle: string) => void;
}

export default function EditableListTitle({
  title,
  onTitleChange,
}: EditableListTitleProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempTitle, setTempTitle] = useState("");

  function handleStartEditing() {
    setTempTitle(title);
    setIsEditing(true);
  }

  function handleSave() {
    if (tempTitle.trim()) {
      onTitleChange(tempTitle.trim());
    }
    setIsEditing(false);
  }

  function handleCancel() {
    setTempTitle("");
    setIsEditing(false);
  }

  return (
    <div className="flex items-center gap-1 flex-1">
      <RenderWhen
        isTrue={isEditing}
        elseElement={
          <div className="flex items-center gap-2 flex-1 group">
            <h1 className="text-xl font-semibold text-gray-900 flex-1 min-w-0">
              {title}
            </h1>
            <button
              onClick={handleStartEditing}
              className="p-1 hover:bg-gray-100 rounded transition-all"
              title="Editar nome da lista"
            >
              <Edit2 className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        }
      >
        <div className="flex items-center">
          <input
            type="text"
            value={tempTitle}
            onChange={(e) => setTempTitle(e.target.value)}
            className="text-xl font-semibold text-gray-900 bg-transparent border-b-2 border-blue-500 outline-none w-5/6"
            placeholder="Nome da lista"
            autoFocus
          />
          <button
            onClick={handleSave}
            className="p-1 hover:bg-green-100 rounded transition-colors"
          >
            <Check className="w-4 h-4 text-green-600" />
          </button>
          <button
            onClick={handleCancel}
            className="p-1 hover:bg-red-100 rounded transition-colors"
          >
            <X className="w-4 h-4 text-red-600" />
          </button>
        </div>
      </RenderWhen>
    </div>
  );
}
