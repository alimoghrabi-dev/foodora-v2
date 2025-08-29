import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import DOMPurify from "dompurify";
import qs from "query-string";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const sanitizeInput = (value: string) => {
  return DOMPurify.sanitize(value);
};

export function formatNumber(num: number | undefined) {
  if (num === null || !num) {
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

export const formUrlQuery = ({
  params,
  key,
  value,
}: {
  params: string;
  key: string;
  value: string | null;
}) => {
  const currentUrl = qs.parse(params);

  currentUrl[key] = value;

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    {
      skipNull: true,
    }
  );
};

export const removeKeysFromQuery = ({
  params,
  keys,
}: {
  params: string;
  keys: string[];
}) => {
  const currentUrl = qs.parse(params);

  keys.forEach((element) => {
    delete currentUrl[element];
  });

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    {
      skipNull: true,
    }
  );
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

export function calculateItemTotal(
  basePrice: number,
  quantity: number,
  variants: { price?: number }[] = [],
  addons: { price?: number }[] = []
): number {
  const variantTotal = variants.reduce((sum, v) => sum + (v.price || 0), 0);
  const addonTotal = addons.reduce((sum, a) => sum + (a.price || 0), 0);

  return (basePrice + variantTotal + addonTotal) * quantity;
}

export function calculateItemTotalWithSale(item: {
  itemId: IMenuItem;
  quantity: number;
  variants: {
    name: string;
    optionName: string;
    optionId: string;
    price: number;
  }[];
  addons: {
    addonId: string;
    name: string;
    price: number;
  }[];
}) {
  const total = calculateItemTotal(
    item.itemId.price,
    item.quantity,
    item.variants,
    item.addons
  );

  if (!item.itemId.onSale) {
    return total;
  }

  if (item.itemId.saleType === "percentage") {
    const discount = (total * (item.itemId.saleAmount || 0)) / 100;
    return Math.max(total - discount, 0);
  }

  if (item.itemId.saleType === "fixed") {
    const discount = item.itemId.saleAmount || 0;
    return Math.max(total - discount, 0);
  }

  return total;
}
