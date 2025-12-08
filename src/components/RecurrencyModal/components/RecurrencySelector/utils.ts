import { RecurrencyConfig } from "@/app/type";
import { calculateNextOccurrence } from "@/app/utils";

export function getInitialConfig(
  mode: "simple" | "weekly" | "monthly",
  interval: number,
  selectedDays: number[]
): RecurrencyConfig {
  const now = new Date();
  const startDate = now.toISOString();

  switch (mode) {
    case "simple": {
      const config: RecurrencyConfig = {
        type: "daily",
        interval: interval,
        startDate,
        endDate: "",
      };
      const endDate = calculateNextOccurrence(config, now);
      return { ...config, endDate: endDate.toISOString() };
    }
    case "weekly": {
      const config: RecurrencyConfig = {
        type: "weekly",
        interval: 1,
        daysOfWeek: selectedDays.length > 0 ? selectedDays : [1],
        startDate,
        endDate: "",
      };
      const endDate = calculateNextOccurrence(config, now);
      return { ...config, endDate: endDate.toISOString() };
    }
    case "monthly": {
      const config: RecurrencyConfig = {
        type: "monthly",
        interval: 1,
        monthlyType: "day_of_month",
        dayOfMonth: 1,
        startDate,
        endDate: "",
      };
      const endDate = calculateNextOccurrence(config, now);
      return { ...config, endDate: endDate.toISOString() };
    }
  }
}
