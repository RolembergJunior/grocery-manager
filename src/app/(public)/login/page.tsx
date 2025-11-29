"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { ShoppingCart, CheckCircle2, ListChecks } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-dvh flex items-center justify-center p-6 bg-white">
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8 items-center">
        <div className="hidden md:block space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[var(--color-blue)] rounded-2xl shadow-lg">
                <ShoppingCart className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-[var(--color-blue)]">
                Grocery Manager
              </h1>
            </div>
            <p className="text-gray-600 text-lg">
              Seu parceiro inteligente para compras e gerenciamento de estoque
            </p>
          </div>

          <div className="space-y-4 pt-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-[var(--color-blue)]/10 rounded-lg mt-1">
                <CheckCircle2 className="w-5 h-5 text-[var(--color-blue)]" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">
                  Rastreie Seu Estoque
                </h3>
                <p className="text-gray-600 text-sm">
                  Saiba o que você tem e o que precisa comprar
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-[var(--color-category-orange)]/10 rounded-lg mt-1">
                <ListChecks className="w-5 h-5 text-[var(--color-category-orange)]" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">
                  Listas de Compras Inteligente
                </h3>
                <p className="text-gray-600 text-sm">
                  Crie e gerencie compras de maneiras organizada
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-[var(--color-category-pink)]/10 rounded-lg mt-1">
                <ShoppingCart className="w-5 h-5 text-[var(--color-category-pink)]" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">
                  Nunca Equeça de Comprar
                </h3>
                <p className="text-gray-600 text-sm">
                  Tenha uma visão clara do que falta
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-10 shadow-2xl border border-gray-100">
            <div className="md:hidden mb-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="p-2 bg-[var(--color-blue)] rounded-xl">
                  <ShoppingCart className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-[var(--color-blue)]">
                  Grocery Manager
                </h1>
              </div>
              <p className="text-gray-600 text-sm">
                Gerenciador de compras e estoque
              </p>
            </div>

            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-gray-800">
                  Bem-vindo de Volta
                </h2>
                <p className="text-gray-600">
                  Entre e gerencie suas listas de compras
                </p>
              </div>

              <div className="pt-4">
                <Button
                  onClick={() => signIn("google", { callbackUrl: "/" })}
                  variant="default"
                  className="w-full h-12 text-base font-medium bg-[var(--color-blue)] hover:bg-[var(--color-blue)]/90 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue com Google
                </Button>
              </div>

              <div className="pt-4 text-center">
                <p className="text-xs text-gray-500">
                  Ao continuar, você concorda com nossos Termos de Serviço e
                  Política de Privacidade
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
