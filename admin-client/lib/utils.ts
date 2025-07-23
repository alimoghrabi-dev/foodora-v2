import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import DOMPurify from "dompurify";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const sanitizeInput = (value: string) => {
  return DOMPurify.sanitize(value);
};

export const formatPriceWithAbbreviation = (value: number): string => {
  const currencySymbol =
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    })
      .formatToParts(0)
      .find((part) => part.type === "currency")?.value || "$";

  const abbreviations = [
    { threshold: 1_000_000_000, suffix: "B" },
    { threshold: 1_000_000, suffix: "M" },
    { threshold: 1_000, suffix: "K" },
  ];

  for (const { threshold, suffix } of abbreviations) {
    if (value >= threshold) {
      return `${currencySymbol}${(value / threshold).toFixed(2)}${suffix}`;
    }
  }

  return `${currencySymbol}${value.toFixed(2)}`;
};

export function formatNumber(num: number | undefined) {
  if (num === null) {
    return "0";
  }

  if (num! < 1000) {
    return num!.toString();
  } else if (num! < 1000000) {
    return (num! / 1000).toFixed(1) + "k";
  } else if (num! < 1000000000) {
    return (num! / 1000000).toFixed(1) + "M";
  } else {
    return (num! / 1000000000).toFixed(1) + "B";
  }
}

export function formatDateToReadableString(dateInput: string | Date): string {
  const date = new Date(dateInput);

  if (isNaN(date.getTime())) {
    throw new Error("Invalid date provided");
  }

  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    day: "2-digit",
    year: "numeric",
  };

  return new Intl.DateTimeFormat("en-US", options).format(date);
}

export function formatDateWithTime(dateInp: Date): string {
  const date = new Date(dateInp);

  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" });

  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;

  return `${day} ${month} • ${hours}:${minutes} ${ampm}`;
}
