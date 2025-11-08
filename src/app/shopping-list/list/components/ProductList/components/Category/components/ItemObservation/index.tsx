"use client";

import React from "react";
import RenderWhen from "@/components/RenderWhen";

interface ItemObservationProps {
  observation?: string;
  isRemoved?: boolean;
}

export default function ItemObservation({
  observation,
  isRemoved = false,
}: ItemObservationProps) {
  return (
    <div
      className={`
        mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100
        transition-all duration-300
        ${isRemoved ? "opacity-60 bg-red-50/50 border-red-100" : ""}
      `}
    >
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${
              isRemoved ? "bg-red-400" : "bg-blue-500"
            }`}
          ></span>
          Observações
        </h2>
      </div>
      <RenderWhen
        isTrue={!!observation}
        elseElement={
          <p className="text-sm text-gray-400 leading-relaxed text-center font-semibold">
            Nenhuma observação
          </p>
        }
      >
        <p
          className={`text-sm leading-relaxed ${
            isRemoved ? "text-gray-500 line-through" : "text-gray-700"
          }`}
        >
          {observation}
        </p>
      </RenderWhen>
    </div>
  );
}
