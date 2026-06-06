"use client";

import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { activateSubscription } from "@/app/actions/subscription";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

function PaymentForm() {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setIsLoading(true);
    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: { return_url: `${window.location.origin}/` },
        redirect: "if_required",
      });

      if (error) {
        if (error.type !== "validation_error") {
          toast.error(error.message || "Erro ao processar pagamento");
        }
        return;
      }

      await activateSubscription();
      toast.success("Assinatura ativada com sucesso!");
      router.replace("/");
    } catch {
      toast.error("Erro inesperado. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <button
        type="submit"
        disabled={!stripe || isLoading}
        className="w-full h-12 bg-[var(--color-blue)] text-white rounded-xl font-semibold hover:bg-[var(--color-blue)]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Processando..." : "Confirmar assinatura"}
      </button>
    </form>
  );
}

interface Props {
  clientSecret: string;
}

export default function SubscribePayment({ clientSecret }: Props) {
  return (
    <Elements
      stripe={stripePromise}
      options={{ clientSecret, locale: "pt-BR" }}
    >
      <PaymentForm />
    </Elements>
  );
}
