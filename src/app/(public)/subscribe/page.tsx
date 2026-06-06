"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, ShoppingCart } from "lucide-react";
import { useFirebaseAuth } from "@/components/AuthProvider";
import { signOutAction } from "@/app/actions/manageAuth";

const BENEFITS = [
  "Gerencie seu inventário de produtos",
  "Crie e compartilhe listas de compras",
  "Configure compras recorrentes automáticas",
];

export default function SubscribePage() {
  const { user, isLoading: authLoading } = useFirebaseAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login");
    }
  }, [authLoading, user, router]);

  async function handleSubscribeClick() {
    if (!user) {
      router.replace("/login");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/stripe/checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Erro ao criar sessão de pagamento");
      }
      const { url } = await res.json();
      if (!url) throw new Error("URL de pagamento não disponível");
      window.location.href = url;
    } catch (err: any) {
      setError(err.message || "Erro inesperado. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-dvh flex items-center justify-center p-6 bg-white">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="p-2 bg-[var(--color-blue)] rounded-xl">
            <ShoppingCart className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--color-blue)]">
            ListaAí
          </h1>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-gray-800">
              Seu teste gratuito acabou
            </h2>
            <p className="text-gray-500 text-sm">
              Assine para continuar usando o ListaAí
            </p>
          </div>

          <div className="space-y-3">
            {BENEFITS.map((benefit) => (
              <div key={benefit} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 text-sm">{benefit}</span>
              </div>
            ))}
          </div>

          <div className="text-center">
            <span className="text-3xl font-bold text-gray-800">R$ 10</span>
            <span className="text-gray-500 text-sm"> / mês</span>
          </div>

          {error && (
            <p className="text-sm text-red-600 text-center">{error}</p>
          )}

          <button
            onClick={handleSubscribeClick}
            disabled={isLoading}
            className="w-full h-12 bg-[var(--color-blue)] text-white rounded-xl font-semibold hover:bg-[var(--color-blue)]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Redirecionando..." : "Assinar Agora"}
          </button>

          <div className="text-center">
            <button
              onClick={signOutAction}
              className="text-sm text-gray-400 hover:text-gray-600 underline"
            >
              Sair da conta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
