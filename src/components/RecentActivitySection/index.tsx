"use client";

import { useAtomValue } from "jotai";
import { productsAtom } from "@/lib/atoms/products";
import { Clock, ShoppingCart, CheckCircle2, Plus } from "lucide-react";
import { useMemo } from "react";
import { STATUSPRODUCT } from "@/app/type";
import RenderWhen from "../RenderWhen";

export default function RecentActivitySection() {
  const products = useAtomValue(productsAtom);

  const activities = useMemo(() => {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const addedToday = products.filter((p) => {
      const createdAt = new Date(p.createdAt);
      return createdAt >= oneDayAgo;
    }).length;

    const needsShoppingYesterday = products.filter((p) => {
      const updatedAt = new Date(p.updatedAt);
      return (
        updatedAt >= twoDaysAgo &&
        updatedAt <= oneDayAgo &&
        p.statusCompra === STATUSPRODUCT.NEED_SHOPPING
      );
    }).length;

    const completedThisWeek = products.filter((p) => {
      const updatedAt = new Date(p.updatedAt);
      return (
        updatedAt >= oneWeekAgo && p.statusCompra === STATUSPRODUCT.COMPLETED
      );
    }).length;

    return [
      {
        id: "today",
        label: "Hoje",
        description: `${addedToday} ${
          addedToday === 1 ? "item foi adicionado" : "itens foram adicionados"
        }`,
        icon: <Plus className="w-4 h-4" />,
        color: "bg-[#6B9BD1]",
        textColor: "text-[#6B9BD1]",
        show: addedToday > 0,
      },
      {
        id: "yesterday",
        label: "Ontem",
        description: `${needsShoppingYesterday} ${
          needsShoppingYesterday === 1
            ? "item marcou precisa comprar"
            : "itens marcaram precisa comprar"
        }`,
        icon: <ShoppingCart className="w-4 h-4" />,
        color: "bg-[#F47E3E]",
        textColor: "text-[#F47E3E]",
        show: needsShoppingYesterday > 0,
      },
      {
        id: "week",
        label: "Esta semana",
        description: `Você comprou ${completedThisWeek} ${
          completedThisWeek === 1 ? "item" : "itens"
        }`,
        icon: <CheckCircle2 className="w-4 h-4" />,
        color: "bg-[#C4C857]",
        textColor: "text-[#897E37]",
        show: completedThisWeek > 0,
      },
    ].filter((activity) => activity.show);
  }, [products]);

  if (activities.length === 0) return null;

  return (
    <>
      <h3 className="text-[var(--color-text-gray)] text-lg font-medium mb-3">
        Atividades Recentes
      </h3>
      <div className="relative mb-6">
        <div className="bg-[var(--color-list-card)] rounded-2xl p-4 shadow-sm">
          <div className="space-y-3">
            {activities.map((activity, index) => (
              <div key={activity.id}>
                <div className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div
                      className={`${activity.color} rounded-full p-1.5 text-white shadow-sm`}
                    >
                      {activity.icon}
                    </div>
                    {index < activities.length - 1 && (
                      <div className="w-0.5 h-8 bg-[var(--color-text-gray)]/20 my-1" />
                    )}
                  </div>

                  <div className="flex-1 pt-0.5">
                    <div className="flex items-baseline gap-2">
                      <span className="text-[var(--color-text-dark)] font-semibold text-sm">
                        {activity.label}:
                      </span>
                      <span className="text-[var(--color-text-gray)] text-sm">
                        {activity.description}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <RenderWhen isTrue={!activities.length}>
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Clock className="w-12 h-12 text-[var(--color-text-gray)]/30 mb-3" />
              <p className="text-[var(--color-text-gray)] text-sm">
                Nenhuma atividade recente
              </p>
            </div>
          </RenderWhen>
        </div>
      </div>
    </>
  );
}
