import { ArrowDown, ArrowRight, ArrowUp, ArrowLeft } from "lucide-react";

interface HighlightPointerProps {
  position: "top" | "bottom" | "left" | "right";
  text: string;
  pulse?: boolean;
}

export default function HighlightPointer({
  position,
  text,
  pulse = true,
}: HighlightPointerProps) {
  const ArrowIcon = {
    top: ArrowUp,
    bottom: ArrowDown,
    left: ArrowLeft,
    right: ArrowRight,
  }[position];

  const positionClasses = {
    top: "flex-col-reverse items-center",
    bottom: "flex-col items-center",
    left: "flex-row-reverse items-center",
    right: "flex-row items-center",
  }[position];

  return (
    <div className={`flex gap-2 ${positionClasses}`}>
      <div
        className={`${
          pulse ? "animate-pulse" : ""
        } text-blue flex items-center justify-center`}
      >
        <ArrowIcon className="w-6 h-6" strokeWidth={3} />
      </div>
      <div className="bg-blue text-white px-3 py-1.5 rounded-lg text-sm font-medium shadow-lg whitespace-nowrap">
        {text}
      </div>
    </div>
  );
}
