import { Loader2, ShoppingCart } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 z-50 flex items-center justify-center">
      <div className="relative">
        <Loader2 className="w-24 h-24 text-blue-600 animate-spin" />

        <div className="absolute inset-0 flex items-center justify-center">
          <ShoppingCart className="w-10 h-10 text-blue-600 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
