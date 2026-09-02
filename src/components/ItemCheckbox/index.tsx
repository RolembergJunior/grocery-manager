"use client";

import { useState, type MouseEvent } from "react";
import { Check, Loader2 } from "lucide-react";
import RenderWhen from "@/components/RenderWhen";

interface ItemCheckboxProps {
  checked: boolean;
  onToggle: () => Promise<void> | void;
  size?: number;
}

/**
 * Checkbox with an in-flight spinner: click -> spinner while the toggle runs ->
 * checked/unchecked. Mirrors the mobile ItemCheckbox.
 */
export default function ItemCheckbox({
  checked,
  onToggle,
  size = 24,
}: ItemCheckboxProps) {
  const [isToggling, setIsToggling] = useState(false);

  async function handleClick(e: MouseEvent) {
    e.stopPropagation();
    if (isToggling) return;
    setIsToggling(true);
    try {
      await onToggle();
    } finally {
      setIsToggling(false);
    }
  }

  const iconSize = Math.round(size * 0.66);

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isToggling}
      className={`shrink-0 flex items-center justify-center rounded-md transition-colors ${
        isToggling
          ? ""
          : `border-2 ${
              checked
                ? "bg-green-500 border-green-500"
                : "bg-white border-gray-300 hover:border-green-400"
            }`
      }`}
      style={{ width: size, height: size }}
    >
      <RenderWhen
        isTrue={isToggling}
        elseElement={
          <RenderWhen isTrue={checked}>
            <Check size={iconSize} className="text-white" strokeWidth={3} />
          </RenderWhen>
        }
      >
        <Loader2 size={size} className="text-gray-400 animate-spin" />
      </RenderWhen>
    </button>
  );
}
