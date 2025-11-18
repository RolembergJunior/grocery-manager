"use client";

import { ShoppingCart, Check } from "lucide-react";
import Modal from "../Modal";
import { useAtomValue } from "jotai";
import { loadingAtom } from "@/lib/atoms/loading";

export default function LoadingFetch() {
  const modalParams = useAtomValue(loadingAtom);

  const { isOpen, message } = modalParams;

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {}}
      showCloseButton={false}
      closeOnOverlayClick={false}
      className="!bg-white/95 backdrop-blur-sm border border-gray-100"
    >
      <div className="flex flex-col items-center justify-center py-2 px-6">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-blue/20 to-green-500/20 rounded-full blur-2xl animate-pulse" />
          <div className="relative bg-gradient-to-br from-blue to-blue/90 p-5 rounded-2xl shadow-xl">
            <ShoppingCart className="w-12 h-12 text-white animate-bounce" />
          </div>
        </div>

        <div className="w-full max-w-xs space-y-3 mb-6">
          {[
            { name: "🍎 Frutas", delay: "0s" },
            { name: "🥖 Pães", delay: "0.5s" },
            { name: "🥛 Laticínios", delay: "1s" },
          ].map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-lg p-3 shadow-sm border border-gray-100 animate-fade-in"
              style={{ animationDelay: item.delay }}
            >
              <div
                className="flex-shrink-0 w-5 h-5 rounded border-2 border-blue flex items-center justify-center animate-check-in"
                style={{ animationDelay: item.delay }}
              >
                <Check
                  className="w-3 h-3 text-blue animate-scale-in"
                  style={{ animationDelay: `calc(${item.delay} + 0.3s)` }}
                />
              </div>
              <span className="text-sm font-medium text-gray-700">
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes check-in {
          0% {
            transform: scale(0);
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
          }
        }

        @keyframes scale-in {
          0% {
            opacity: 0;
            transform: scale(0);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }

        .animate-check-in {
          animation: check-in 0.4s ease-out forwards;
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease-out forwards;
        }
      `}</style>
    </Modal>
  );
}
