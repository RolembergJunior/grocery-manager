import { updateListItem } from "@/services/list-items";
import { Minus, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// Quantity Control Component
interface QuantityControlProps {
  itemId: string;
  boughtQuantity: number;
  neededQuantity: number;
  unit: string;
  disabled?: boolean;
}

export default function QuantityControl({
  itemId,
  boughtQuantity: initialBought,
  neededQuantity,
  unit,
  disabled = false,
}: QuantityControlProps) {
  const [boughtQuantity, setBoughtQuantity] = useState(initialBought);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(String(initialBought));
  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    setBoughtQuantity(initialBought);
    setInputValue(String(initialBought));
  }, [initialBought]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  async function updateQuantity(newQuantity: number) {
    if (newQuantity < 0 || newQuantity === boughtQuantity) return;

    setBoughtQuantity(newQuantity);
    setInputValue(String(newQuantity));

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(async () => {
      setIsUpdating(true);
      try {
        await updateListItem(itemId, { boughtQuantity: newQuantity });
      } catch (error) {
        setBoughtQuantity(initialBought);
        setInputValue(String(initialBought));
        toast.error("Erro ao atualizar quantidade");
      } finally {
        setIsUpdating(false);
      }
    }, 800);
  }

  function handleIncrement() {
    if (disabled || isUpdating) return;
    const newValue = Math.min(boughtQuantity + 1, neededQuantity);
    updateQuantity(newValue);
  }

  function handleDecrement() {
    if (disabled || isUpdating || boughtQuantity === 0) return;
    updateQuantity(boughtQuantity - 1);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;

    if (value === "") {
      setInputValue("");
      return;
    }

    if (!/^\d+$/.test(value)) return;

    const numValue = parseInt(value, 10);
    if (numValue > neededQuantity) {
      setInputValue(String(neededQuantity));
      updateQuantity(neededQuantity);
      return;
    }

    setInputValue(value);
    updateQuantity(numValue);
  }

  function handleInputBlur() {
    setIsEditing(false);

    if (inputValue === "") {
      setInputValue(String(boughtQuantity));
    }
  }

  function handleInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === "Escape") {
      inputRef.current?.blur();
    }
  }

  const isComplete = boughtQuantity >= neededQuantity;

  return (
    <div className="flex items-center gap-2 shrink-0">
      <button
        onClick={handleDecrement}
        disabled={boughtQuantity === 0 || isUpdating || disabled}
        className="w-7 h-7 rounded-md bg-white border border-gray-300 hover:bg-gray-50 active:bg-gray-100 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        aria-label="Diminuir quantidade"
      >
        <Minus className="w-3.5 h-3.5 text-gray-600" />
      </button>

      <div
        className="px-3 py-1.5 bg-white border border-gray-300 rounded-md min-w-[100px] cursor-text hover:border-gray-400 transition-colors"
        onClick={() => !disabled && setIsEditing(true)}
      >
        <div className="flex items-center justify-center gap-1 text-sm">
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              inputMode="numeric"
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              onKeyDown={handleInputKeyDown}
              disabled={disabled || isUpdating}
              className="w-6 text-center font-semibold bg-transparent border-none outline-none focus:ring-0 text-gray-900"
              aria-label="Quantidade comprada"
            />
          ) : (
            <span
              className={`font-semibold ${
                isComplete ? "text-green-600" : "text-gray-900"
              }`}
            >
              {boughtQuantity}
            </span>
          )}
          <span className="text-gray-400">/</span>
          <span className="font-medium text-gray-600">{neededQuantity}</span>
          <span className="text-gray-500">{unit}</span>
        </div>
      </div>

      <button
        onClick={handleIncrement}
        disabled={isComplete || isUpdating || disabled}
        className="w-7 h-7 rounded-md bg-white border border-gray-300 hover:bg-gray-50 active:bg-gray-100 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        aria-label="Aumentar quantidade"
      >
        <Plus className="w-3.5 h-3.5 text-gray-600" />
      </button>
    </div>
  );
}
