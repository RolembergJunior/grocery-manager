"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, ShoppingCart } from "lucide-react";
import { useFirebaseAuth } from "@/components/AuthProvider";
import { signOutAction } from "@/app/actions/manageAuth";
import SubscribePayment from "@/components/SubscribePayment";

const BENEFITS = [
  "Gerencie seu inventário de produtos",
  "Crie e compartilhe listas de compras",
  "Configure compras recorrentes automáticas",
];

export default function SubscribePage() {
  const { user } = useFirebaseAuth();
  const router = useRouter();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubscribeClick() {
    if (!user) {
      router.replace("/login");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const profileRes = await fetch(`/api/profile?userId=${user.uid}`);
      if (!profileRes.ok) throw new Error("Perfil não encontrado");
      const { profile } = await profileRes.json();

      if (!profile?.stripeCustomerId) {
        setError("Erro ao preparar assinatura. Tente sair e entrar novamente.");
        return;
      }

      const subRes = await fetch("/api/stripe/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stripeCustomerId: profile.stripeCustomerId }),
      });
      if (!subRes.ok) throw new Error("Erro ao criar assinatura");
      const { paymentIntent } = await subRes.json();
      setClientSecret(paymentIntent);
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

        {clientSecret ? (
          <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
              Dados do cartão
            </h2>
            <SubscribePayment clientSecret={clientSecret} />
          </div>
        ) : (
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
              {isLoading ? "Carregando..." : "Assinar Agora"}
            </button>

            <div className="text-center">
              <button
                onClick={() => signOutAction()}
                className="text-sm text-gray-400 hover:text-gray-600 underline"
              >
                Sair da conta
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
