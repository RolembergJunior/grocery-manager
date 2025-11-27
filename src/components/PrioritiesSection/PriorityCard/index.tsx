"use client";

import { Product } from "@/app/type";
import RenderWhen from "@/components/RenderWhen";
import { useState } from "react";
import PriorityProductsModal from "./components/PriorityProductsModal";

interface PriorityCardProps {
  title: string;
  count: number;
  items: Product[];
  icon: React.ReactNode;
  colorClass: string;
  textColorClass: string;
}

export default function PriorityCard({
  title,
  count,
  items,
  icon,
  colorClass,
  textColorClass,
}: PriorityCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setIsModalOpen(true)}
        className={`${colorClass} rounded-2xl p-4 flex flex-col min-w-[200px] max-w-[200px] flex-shrink-0 shadow-md hover:shadow-lg transition-all duration-300 snap-start cursor-pointer active:scale-95 group`}
      >
        <div className="flex items-center justify-between mb-3">
          <div className={`${textColorClass} flex items-center gap-2`}>
            {icon}
            <span className="font-semibold text-sm">{title}</span>
          </div>
          <span
            className={`${textColorClass} text-xs bg-white/20 px-2 py-1 rounded-full font-medium`}
          >
            {count}
          </span>
        </div>
        <div className="space-y-1.5">
          {items.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className={`${textColorClass} text-xs bg-white/10 px-2 py-1.5 rounded-lg truncate group-hover:bg-white/20 transition-colors`}
            >
              {item.name}
            </div>
          ))}

          <RenderWhen isTrue={count > 3}>
            <div
              className={`${textColorClass} text-xs text-center opacity-75 pt-1`}
            >
              +{count - 3} mais
            </div>
          </RenderWhen>
        </div>
      </div>

      <PriorityProductsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={title}
        icon={icon}
        items={items}
        colorClass={colorClass}
      />
    </>
  );
}
