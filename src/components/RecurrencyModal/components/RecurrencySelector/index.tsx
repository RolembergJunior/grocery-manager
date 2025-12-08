"use client";

import { RecurrencyConfig } from "@/app/type";
import { useState, useEffect } from "react";
import RenderWhen from "@/components/RenderWhen";
import { getInitialConfig } from "./utils";
import ModeSelector from "./components/ModeSelector";
import SimpleMode from "./components/SimpleMode";
import WeeklyMode from "./components/WeeklyMode";
import MonthlyMode from "./components/MonthlyMode";
import RecurrencySummary from "./components/RecurrencySummary";
import { calculateNextOccurrence } from "@/app/utils";

interface RecurrencySelectorProps {
  value: RecurrencyConfig | null;
  onChange: (config: RecurrencyConfig | null) => void;
}

export default function RecurrencySelector({
  value,
  onChange,
}: RecurrencySelectorProps) {
  const [mode, setMode] = useState<"none" | "simple" | "weekly" | "monthly">(
    "none"
  );
  const [interval, setInterval] = useState(7);
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [monthlyType, setMonthlyType] = useState<
    "day_of_month" | "day_of_week"
  >("day_of_month");
  const [dayOfMonth, setDayOfMonth] = useState(1);
  const [weekOfMonth, setWeekOfMonth] = useState(1);
  const [dayOfWeek, setDayOfWeek] = useState(1);

  useEffect(() => {
    if (!value) {
      setMode("none");
      return;
    }

    if (value.type === "daily") {
      setMode("simple");
      setInterval(value.interval);
    } else if (value.type === "weekly") {
      setMode("weekly");
      setInterval(value.interval);
      setSelectedDays(value.daysOfWeek || []);
    } else if (value.type === "monthly") {
      setMode("monthly");
      setInterval(value.interval);
      setMonthlyType(value.monthlyType || "day_of_month");

      if (value.monthlyType === "day_of_month") {
        setDayOfMonth(value.dayOfMonth || 1);
      } else if (value.monthlyType === "day_of_week") {
        setWeekOfMonth(value.weekOfMonth || 1);
        setDayOfWeek(value.dayOfWeek || 1);
      }
    }
  }, [value]);

  function handleModeChange(newMode: string) {
    if (newMode === "none") {
      setMode("none");
      onChange(null);

      return;
    }

    const modeValue = newMode as "simple" | "weekly" | "monthly";
    const initialConfig = getInitialConfig(modeValue, interval, selectedDays);

    setMode(modeValue);
    onChange(initialConfig);
  }

  function toggleWeekday(day: number) {
    const newDays = selectedDays.includes(day)
      ? selectedDays.filter((d) => d !== day)
      : [...selectedDays, day].sort();

    setSelectedDays(newDays);
    handleChangeRecurrency("daysOfWeek", newDays);
  }

  function handleMonthlyTypeChange(type: "day_of_month" | "day_of_week") {
    setMonthlyType(type);
    handleChangeRecurrency("monthlyType", type);
  }

  function handleChangeRecurrency(
    propName: keyof RecurrencyConfig,
    propValue: any
  ) {
    const now = new Date();

    const config = {
      ...value,
      [propName]: propValue,
      startDate: now.toISOString(),
      endDate: "",
    } as RecurrencyConfig;

    const endDate = calculateNextOccurrence(config, now).toISOString();

    onChange({
      ...config,
      endDate,
    });
  }

  return (
    <div className="space-y-4">
      <ModeSelector mode={mode} onModeChange={handleModeChange} />

      <RenderWhen isTrue={mode === "simple"}>
        <SimpleMode
          interval={interval}
          onIntervalChange={(value: number) => {
            handleChangeRecurrency("interval", value);
            setInterval(value);
          }}
        />
      </RenderWhen>

      <RenderWhen isTrue={mode === "weekly"}>
        <WeeklyMode
          selectedDays={selectedDays}
          interval={interval}
          onToggleWeekday={toggleWeekday}
          onIntervalChange={(value: number) => {
            handleChangeRecurrency("interval", value);
            setInterval(value);
          }}
        />
      </RenderWhen>

      <RenderWhen isTrue={mode === "monthly"}>
        <MonthlyMode
          monthlyType={monthlyType}
          dayOfMonth={dayOfMonth}
          weekOfMonth={weekOfMonth}
          dayOfWeek={dayOfWeek}
          interval={interval}
          onMonthlyTypeChange={handleMonthlyTypeChange}
          onDayOfMonthChange={(value: number) => {
            handleChangeRecurrency("dayOfMonth", value);
            setDayOfMonth(value);
          }}
          onWeekOfMonthChange={(value: number) => {
            handleChangeRecurrency("weekOfMonth", value);
            setWeekOfMonth(value);
          }}
          onDayOfWeekChange={(value: number) => {
            handleChangeRecurrency("dayOfWeek", value);
            setDayOfWeek(value);
          }}
          onIntervalChange={(value: number) => {
            handleChangeRecurrency("interval", value);
            setInterval(value);
          }}
        />
      </RenderWhen>

      <RenderWhen isTrue={mode !== "none"}>
        <RecurrencySummary
          mode={mode as "simple" | "weekly" | "monthly"}
          interval={interval}
          selectedDays={selectedDays}
          monthlyType={monthlyType}
          dayOfMonth={dayOfMonth}
          weekOfMonth={weekOfMonth}
          dayOfWeek={dayOfWeek}
          onRemove={() => handleModeChange("none")}
        />
      </RenderWhen>
    </div>
  );
}
