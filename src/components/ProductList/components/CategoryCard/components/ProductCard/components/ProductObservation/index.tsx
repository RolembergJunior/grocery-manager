"use client";

import { Item } from "@/app/type";
import { Edit, Minus, Plus } from "lucide-react";
import { useState } from "react";
import RenderWhen from "@/components/RenderWhen";
import { toast } from "sonner";
import { updateOrCreate } from "@/services/products";

interface ProductObservationProps {
  item: Item;
}

export default function ProductObservation({ item }: ProductObservationProps) {
  const [showTextArea, setShowTextArea] = useState(false);
  const [observation, setObservation] = useState(item.observation || "");

  function handleSave() {
    toast.promise(
      updateOrCreate({
        ...item,
        observation,
      }),
      {
        loading: "Salvando...",
        success: "Observação salva com sucesso!",
        error:
          "Houve um erro ao tentar salvar a observação do item. Tente novamente mais tarde, por favor.",
      }
    );

    setShowTextArea(false);
  }

  return (
    <>
      <RenderWhen isTrue={!observation}>
        <button
          className="flex items-center justify-center gap-2 w-full hover:bg-blue-50 active:bg-blue-100 p-3 rounded-xl cursor-pointer mt-3 border border-dashed border-blue-200 hover:border-blue-300 transition-all duration-200 group"
          onClick={() => setShowTextArea(!showTextArea)}
        >
          <span className="text-sm font-medium text-blue-600 group-hover:text-blue-700">
            Adicionar notas
          </span>
          <RenderWhen isTrue={!showTextArea}>
            <Plus className="w-4 h-4 text-blue-500 group-hover:text-blue-600 transition-colors" />
          </RenderWhen>
          <RenderWhen isTrue={showTextArea}>
            <Minus className="w-4 h-4 text-blue-500 group-hover:text-blue-600 transition-colors" />
          </RenderWhen>
        </button>
      </RenderWhen>

      <RenderWhen isTrue={showTextArea}>
        <div className="mt-3 space-y-3">
          <textarea
            value={observation}
            onChange={(e) => setObservation(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-xl text-gray-800 resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-200 placeholder-gray-400 shadow-sm"
            rows={3}
            placeholder="Digite suas observações aqui..."
          />

          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex-1 p-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Salvar
            </button>
            <button
              onClick={() => setShowTextArea(false)}
              className="px-4 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 active:bg-gray-100 text-gray-600 font-medium transition-all duration-200"
            >
              Cancelar
            </button>
          </div>
        </div>
      </RenderWhen>

      <RenderWhen isTrue={!!observation && !showTextArea}>
        <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Observações
            </h2>
            <button
              onClick={() => setShowTextArea(true)}
              className="hover:bg-white active:bg-gray-100 p-2 rounded-lg transition-all duration-200 group"
              title="Editar observação"
            >
              <Edit className="w-4 h-4 text-gray-500 group-hover:text-primary-orange-hover transition-colors" />
            </button>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">{observation}</p>
        </div>
      </RenderWhen>
    </>
  );
}
