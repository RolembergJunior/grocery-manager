"use client";

import { Product } from "@/app/type";
import Modal from "@/components/Modal";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { updateOrCreate } from "@/services/products";
import { useAtomValue, useSetAtom } from "jotai";
import { productsAtom } from "@/lib/atoms/products";
import { categoriesAtom } from "@/lib/atoms/categories";
import { getCategoryName } from "@/lib/utils";
import { X, Filter, Calendar, Trash, SkipForward } from "lucide-react";
import RenderWhen from "@/components/RenderWhen";
import RecurrencyCalendar from "./components/RecurrencyCalendar";
import { formatDate, getDaysUntil } from "./utils";
import { getNextRecurrence, getRecurrencyDescription } from "@/app/utils";

interface RecurrencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  icon: React.ReactNode;
  items: Product[];
}

export default function RecurrencyModal({
  isOpen,
  onClose,
  title,
  icon,
  items,
}: RecurrencyModalProps) {
  const setProducts = useSetAtom(productsAtom);
  const categories = useAtomValue(categoriesAtom);
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const filteredItems = useMemo(() => {
    if (!selectedDate) return items;

    return items.filter((product) => {
      const nextRecurrence = getNextRecurrence(product);

      return (
        nextRecurrence.getFullYear() === selectedDate.getFullYear() &&
        nextRecurrence.getMonth() === selectedDate.getMonth() &&
        nextRecurrence.getDate() === selectedDate.getDate()
      );
    });
  }, [items, selectedDate]);

  const groupedByCategory = useMemo(() => {
    const groups = filteredItems.reduce((acc, product) => {
      const categoryId = product.category || "uncategorized";
      const categoryName =
        getCategoryName(categories, categoryId) || "Sem categoria";
      if (!acc[categoryName]) {
        acc[categoryName] = [];
      }
      acc[categoryName].push(product);
      return acc;
    }, {} as Record<string, Product[]>);

    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  }, [filteredItems, categories]);

  const calendarDates = useMemo(() => {
    const dates: Date[] = [];

    items.forEach((product) => {
      const nextRecurrence = getNextRecurrence(product);
      dates.push(nextRecurrence);
    });

    return dates;
  }, [items]);

  const calendarEvents = useMemo(() => {
    const events: { date: Date; product: Product; isOverdue: boolean }[] = [];
    const now = new Date();

    items.forEach((product) => {
      const nextRecurrence = getNextRecurrence(product);
      events.push({
        date: nextRecurrence,
        product,
        isOverdue: nextRecurrence < now,
      });
    });

    return events.sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [items]);

  async function handleCancelRecurrency(product: Product) {
    setUpdatingItems((prev) => new Set(prev).add(product.id));

    toast.promise(
      updateOrCreate({
        ...product,
        recurrencyConfig: null,
      }),
      {
        loading: "Cancelando recorrência...",
        success: () => {
          setProducts((prev) =>
            prev.map((p) =>
              p.id === product.id ? { ...p, recurrencyConfig: null } : p
            )
          );
          setUpdatingItems((prev) => {
            const next = new Set(prev);
            next.delete(product.id);
            return next;
          });
          return "Recorrência cancelada!";
        },
        error: () => {
          setUpdatingItems((prev) => {
            const next = new Set(prev);
            next.delete(product.id);
            return next;
          });
          return "Erro ao cancelar recorrência";
        },
      }
    );
  }

  // async function handleSkipToNext(product: Product) {
  //   setUpdatingItems((prev) => new Set(prev).add(product.id));

  //   const now = new Date().toISOString();

  //   toast.promise(updateOrCreate({ ...product, updatedAt: now }), {
  //     loading: "Atualizando recorrência...",
  //     success: () => {
  //       setProducts((prev) =>
  //         prev.map((p) => (p.id === product.id ? { ...p, updatedAt: now } : p))
  //       );
  //       setUpdatingItems((prev) => {
  //         const next = new Set(prev);
  //         next.delete(product.id);
  //         return next;
  //       });
  //       return "Recorrência atualizada!";
  //     },
  //     error: () => {
  //       setUpdatingItems((prev) => {
  //         const next = new Set(prev);
  //         next.delete(product.id);
  //         return next;
  //       });
  //       return "Erro ao atualizar recorrência";
  //     },
  //   });
  // }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      iconTitle={icon}
      title={title}
      size="xl"
    >
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-5 h-5 text-blue-600" />
            <h4 className="font-semibold text-gray-800">
              Próximas Recorrências
            </h4>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {calendarEvents.map((event, idx) => {
              const daysUntil = getDaysUntil(event.date);
              return (
                <div
                  key={`${event.product.id}-${idx}`}
                  className={`flex items-center justify-between p-2 rounded-lg ${
                    event.isOverdue
                      ? "bg-red-100 border border-red-300"
                      : "bg-white border border-gray-200"
                  }`}
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {event.product.name}
                    </p>
                    <p className="text-xs text-gray-600">
                      {formatDate(event.date)}
                    </p>
                  </div>
                  <div
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      event.isOverdue
                        ? "bg-red-200 text-red-800"
                        : daysUntil <= 3
                        ? "bg-yellow-200 text-yellow-800"
                        : "bg-green-200 text-green-800"
                    }`}
                  >
                    {event.isOverdue
                      ? `${Math.abs(daysUntil)} dias atrás`
                      : daysUntil === 0
                      ? "Hoje"
                      : daysUntil === 1
                      ? "Amanhã"
                      : `${daysUntil} dias`}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <RecurrencyCalendar
          dates={calendarDates}
          onDateSelect={setSelectedDate}
          selectedDate={selectedDate}
        />

        <RenderWhen isTrue={selectedDate !== null}>
          <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">
                Filtrando por:{" "}
                {selectedDate?.toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
            <button
              onClick={() => setSelectedDate(null)}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
            >
              Limpar filtro
            </button>
          </div>
        </RenderWhen>

        <div className="text-sm text-gray-600">
          Mostrando{" "}
          <span className="font-semibold text-gray-900">
            {filteredItems.length}
          </span>{" "}
          {filteredItems.length === 1 ? "item" : "itens"}
          {selectedDate && ` para esta data`}
        </div>

        <RenderWhen isTrue={filteredItems.length === 0}>
          <div className="text-center py-12">
            <div className="text-gray-400 mb-2">
              <Filter className="w-12 h-12 mx-auto" />
            </div>
            <p className="text-gray-600 font-medium">Nenhum item encontrado</p>
            <p className="text-sm text-gray-500 mt-1">
              {selectedDate
                ? "Não há itens agendados para esta data"
                : "Não há itens para exibir"}
            </p>
          </div>
        </RenderWhen>

        <RenderWhen isTrue={filteredItems.length > 0}>
          <div className="space-y-5">
            {groupedByCategory.map(([category, products]) => (
              <div key={category} className="space-y-2.5">
                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider border-b-2 border-gray-300 pb-2">
                  {category}
                </h3>
                <div className="space-y-2">
                  {products.map((product) => {
                    const isUpdating = updatingItems.has(product.id);
                    const nextRecurrence = getNextRecurrence(product);
                    const daysUntil = getDaysUntil(nextRecurrence);

                    return (
                      <div
                        key={product.id}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-200"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1">
                            <p className="font-semibold text-gray-900 text-sm leading-tight mb-1">
                              {product.name}
                            </p>

                            <span className="text-gray-400">•</span>

                            <span className="text-sm text-gray-600">
                              {getRecurrencyDescription(product)}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <span>
                              <RenderWhen isTrue={daysUntil < 0}>
                                <span className="text-red-600 font-medium ml-1">
                                  (Atrasada)
                                </span>
                              </RenderWhen>
                              {formatDate(nextRecurrence)}
                            </span>
                          </div>
                        </div>
                        <div>
                          {/* <button
                            onClick={() => handleSkipToNext(product)}
                            disabled={isUpdating}
                            className={`
                            flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200
                            bg-blue text-white hover:bg-blue/90 shadow-sm hover:shadow-md
                            ${
                              isUpdating
                                ? "opacity-50 cursor-not-allowed"
                                : "cursor-pointer active:scale-95"
                            }
                          `}
                            title="Marcar como feito e ir para próxima"
                          >
                            <SkipForward className="w-3.5 h-3.5" />
                            Próxima
                          </button> */}
                          <button
                            onClick={() => handleCancelRecurrency(product)}
                            disabled={isUpdating}
                            className={`
                            flex items-center gap-1.5 p-3 rounded-lg text-xs font-semibold transition-all duration-200
                            bg-red-500 text-white hover:bg-red-600 shadow-sm hover:shadow-md
                            ${
                              isUpdating
                                ? "opacity-50 cursor-not-allowed"
                                : "cursor-pointer active:scale-95"
                            }
                          `}
                            title="Cancelar recorrência"
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </RenderWhen>
      </div>
    </Modal>
  );
}
