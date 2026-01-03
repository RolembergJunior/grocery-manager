import {
  addDays,
  addWeeks,
  addMonths,
  setDate,
  getDay,
  getDaysInMonth,
  startOfMonth,
  endOfMonth,
} from "date-fns";
import { Product, RecurrencyConfig } from "./type";

export const categoryOptions = [
  { value: "fridge", label: "Geladeira" },
  { value: "cupboard", label: "Armário" },
  { value: "freezer", label: "Congelador" },
  { value: "pantry", label: "Despensa" },
  { value: "produce", label: "Hortifrúti" },
  { value: "dairy", label: "Lácteos" },
  { value: "meat", label: "Carnes" },
  { value: "cleaning", label: "Limpeza" },
  { value: "personal-hygiene", label: "Higiene Pessoal" },
  { value: "other", label: "Outro" },
];

export const unitOptions = [
  { value: "pcs", label: "Unidade", alias: "und" },
  { value: "kg", label: "Kilogramas", alias: "kg" },
  { value: "g", label: "Gramas", alias: "g" },
  { value: "l", label: "Litros", alias: "l" },
  { value: "ml", label: "Mililitros", alias: "ml" },
  { value: "lbs", label: "Libras", alias: "lbs" },
  { value: "oz", label: "Onças", alias: "oz" },
  { value: "cups", label: "Xícaras", alias: "Xíc" },
  { value: "spoons", label: "Colheres", alias: "Col." },
];

export const buyStatusOptions = [
  { value: 1, label: "Comprar" },
  { value: 2, label: "Acabando" },
  { value: 3, label: "Tem" },
];

export const palletColors = {
  1: {
    name: "Laranja",
    backgroundColor: "#EF702D",
    color: "white",
    borderColor: "#EF702D",
    hoverBackgroundColor: "#EF702D",
    hoverColor: "white",
    // Tailwind classes
    bgClass: "bg-[#EF702D]",
    textClass: "text-white",
    borderClass: "border-[#EF702D]",
    hoverBgClass: "hover:bg-[#EF702D]",
    hoverTextClass: "hover:text-white",
  },
  2: {
    name: "Azul Acinzentado",
    backgroundColor: "#7298C7",
    color: "white",
    borderColor: "#7298C7",
    hoverBackgroundColor: "#7298C7",
    hoverColor: "white",
    // Tailwind classes
    bgClass: "bg-[#7298C7]",
    textClass: "text-white",
    borderClass: "border-[#7298C7]",
    hoverBgClass: "hover:bg-[#7298C7]",
    hoverTextClass: "hover:text-white",
  },
  3: {
    name: "Rosa",
    backgroundColor: "#E36887",
    color: "white",
    borderColor: "#E36887",
    hoverBackgroundColor: "#E36887",
    hoverColor: "white",
    // Tailwind classes
    bgClass: "bg-[#E36887]",
    textClass: "text-white",
    borderClass: "border-[#E36887]",
    hoverBgClass: "hover:bg-[#E36887]",
    hoverTextClass: "hover:text-white",
  },
  4: {
    name: "Oliva",
    backgroundColor: "#897E37",
    color: "white",
    borderColor: "#897E37",
    hoverBackgroundColor: "#897E37",
    hoverColor: "white",
    // Tailwind classes
    bgClass: "bg-[#897E37]",
    textClass: "text-[#E4D579]",
    borderClass: "border-[#897E37]",
    hoverBgClass: "hover:bg-[#897E37]",
    hoverTextClass: "hover:text-white",
  },
  5: {
    name: "Pêssego",
    backgroundColor: "#FBE6C9",
    color: "white",
    borderColor: "#FBE6C9",
    hoverBackgroundColor: "#FBE6C9",
    hoverColor: "white",
    // Tailwind classes
    bgClass: "bg-[#FBE6C9]",
    textClass: "text-[#EF702D]",
    borderClass: "border-[#FBE6C9]",
    hoverBgClass: "hover:bg-[#FBE6C9]",
    hoverTextClass: "hover:text-white",
  },
  6: {
    name: "Cinza Claro",
    backgroundColor: "#E4E8EB",
    color: "white",
    borderColor: "#E4E8EB",
    hoverBackgroundColor: "#E4E8EB",
    hoverColor: "white",
    // Tailwind classes
    bgClass: "bg-[#E4E8EB]",
    textClass: "text-[#6C7B8D]",
    borderClass: "border-[#E4E8EB]",
    hoverBgClass: "hover:bg-[#E4E8EB]",
    hoverTextClass: "hover:text-white",
  },
  7: {
    name: "Rosa Claro",
    backgroundColor: "#F8DAD8",
    color: "white",
    borderColor: "#F8DAD8",
    hoverBackgroundColor: "#F8DAD8",
    hoverColor: "white",
    // Tailwind classes
    bgClass: "bg-[#F8DAD8]",
    textClass: "text-[#E36887]",
    borderClass: "border-[#F8DAD8]",
    hoverBgClass: "hover:bg-[#F8DAD8]",
    hoverTextClass: "hover:text-white",
  },
  8: {
    name: "Amarelo Mostarda",
    backgroundColor: "#E4D579",
    color: "white",
    borderColor: "#E4D579",
    hoverBackgroundColor: "#E4D579",
    hoverColor: "white",
    // Tailwind classes
    bgClass: "bg-[#E4D579]",
    textClass: "text-[#655C23]",
    borderClass: "border-[#E4D579]",
    hoverBgClass: "hover:bg-[#E4D579]",
    hoverTextClass: "hover:text-white",
  },
};

export function calculateStatistics(products: Product[]): {
  totalItems: number;
  needsShopping: number;
  totalCategories: number;
} {
  if (!products.length)
    return { totalItems: 0, needsShopping: 0, totalCategories: 0 };

  const totalItems = products.length;
  const needsShopping = products.filter(
    (item) => item.neededQuantity > 0
  ).length;
  const totalCategories = new Set(products.map((i) => i.category)).size;

  return { totalItems, needsShopping, totalCategories };
}

export function getAllItems(products: Product[]): Product[] {
  return [...products].sort((a: Product, b: Product) => {
    const statusOrder: { [key: string]: number } = {
      "needs-shopping": 0,
      "almost-empty": 1,
      full: 2,
    };
    const statusA = getItemStatus(a);
    const statusB = getItemStatus(b);

    if (statusOrder[statusA] !== statusOrder[statusB]) {
      return statusOrder[statusA] - statusOrder[statusB];
    }

    return a.name.localeCompare(b.name);
  });
}

function getItemStatus(item: Product): string {
  if (item.neededQuantity > 0) {
    return "needs-shopping";
  } else if (item.currentQuantity <= 2 && item.currentQuantity > 0) {
    return "almost-empty";
  } else if (item.currentQuantity > 2) {
    return "full";
  } else {
    return "needs-shopping";
  }
}

export function getUnitName(unit: string): string {
  return (
    unitOptions.find((c) => c.value === unit?.toLowerCase())?.alias || unit
  );
}

export function findNextWeekday(daysOfWeek: number[], interval: number): Date {
  const dateNow = new Date();

  if (!daysOfWeek || daysOfWeek.length === 0) {
    return addWeeks(dateNow, interval);
  }

  const sortedDays = [...daysOfWeek].sort((a, b) => a - b);
  const currentDay = getDay(dateNow);

  const nextDayThisWeek = sortedDays.find((day) => day > currentDay);

  if (nextDayThisWeek !== undefined) {
    const daysUntil = nextDayThisWeek - currentDay;

    return addDays(dateNow, daysUntil);
  }

  const daysUntilNextWeek = 7 - currentDay + sortedDays[0];
  const nextDate = addDays(dateNow, daysUntilNextWeek);

  if (interval > 1) {
    return addWeeks(nextDate, interval - 1);
  }

  return nextDate;
}

export function findNextDayOfMonth(dayOfMonth: number, interval: number): Date {
  const dateNow = new Date();
  const currentMonth = dateNow.getMonth();
  const currentYear = dateNow.getFullYear();

  let nextDate = new Date(currentYear, currentMonth, dayOfMonth);

  if (nextDate <= dateNow) {
    nextDate = addMonths(nextDate, interval);
  }

  const daysInTargetMonth = getDaysInMonth(nextDate);
  if (dayOfMonth > daysInTargetMonth) {
    nextDate = endOfMonth(nextDate);
  }

  return nextDate;
}

export function findNextWeekdayOfMonth(
  weekOfMonth: number,
  dayOfWeek: number,
  interval: number
): Date {
  const dateNow = new Date();

  const findNthWeekdayOfMonth = (
    date: Date,
    nth: number,
    weekday: number
  ): Date => {
    const firstDay = startOfMonth(date);
    const firstWeekday = getDay(firstDay);

    let daysUntilWeekday = (weekday - firstWeekday + 7) % 7;

    if (nth === -1) {
      const lastDay = endOfMonth(date);
      const lastWeekday = getDay(lastDay);
      const daysBack = (lastWeekday - weekday + 7) % 7;
      return addDays(lastDay, -daysBack);
    }

    const targetDate = addDays(firstDay, daysUntilWeekday + (nth - 1) * 7);

    if (targetDate.getMonth() !== date.getMonth()) {
      return findNthWeekdayOfMonth(date, -1, weekday);
    }

    return targetDate;
  };

  let currentMonth = new Date(dateNow);
  let nextDate = findNthWeekdayOfMonth(currentMonth, weekOfMonth, dayOfWeek);

  if (nextDate <= dateNow) {
    currentMonth = addMonths(currentMonth, interval);
    nextDate = findNthWeekdayOfMonth(currentMonth, weekOfMonth, dayOfWeek);
  }

  return nextDate;
}

export function calculateNextOccurrence(
  config: RecurrencyConfig,
  lastUpdate: Date
): Date {
  switch (config.type) {
    case "daily":
      return addDays(lastUpdate, config.interval);

    case "weekly":
      return findNextWeekday(config.daysOfWeek!, config.interval);

    case "monthly":
      if (config.monthlyType === "day_of_month") {
        return findNextDayOfMonth(config.dayOfMonth!, config.interval);
      }

      return findNextWeekdayOfMonth(
        config.weekOfMonth!,
        config.dayOfWeek!,
        config.interval
      );

    default:
      return addDays(lastUpdate, config.interval);
  }
}

export function getNextRecurrence(product: Product): Date {
  if (product.recurrencyConfig) {
    return calculateNextOccurrence(
      product.recurrencyConfig,
      new Date(product.updatedAt)
    );
  }

  return new Date();
}

export function getRecurrencyDescription(product: Product) {
  if (product.recurrencyConfig) {
    const {
      type,
      interval,
      daysOfWeek,
      monthlyType,
      dayOfMonth,
      weekOfMonth,
      dayOfWeek,
    } = product.recurrencyConfig;

    if (type === "daily") {
      return `A cada ${interval} ${interval === 1 ? "dia" : "dias"}`;
    }
    if (type === "weekly" && daysOfWeek) {
      const weekdays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
      const days = daysOfWeek.map((d) => weekdays[d]).join(", ");
      return `Toda${interval > 1 ? `s ${interval} semanas em` : ""} ${days}`;
    }
    if (type === "monthly") {
      if (monthlyType === "day_of_month") {
        return `Todo dia ${dayOfMonth} do mês`;
      }
      const weekdays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
      const positions = [
        "",
        "Primeira",
        "Segunda",
        "Terceira",
        "Quarta",
        "",
        "",
        "",
        "",
        "",
        "Última",
      ];
      const position = weekOfMonth === -1 ? "Última" : positions[weekOfMonth!];
      return `${position} ${weekdays[dayOfWeek!]} do mês`;
    }
  }

  return "Sem recorrência";
}
