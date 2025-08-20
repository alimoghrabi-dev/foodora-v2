"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

const BUTTONS = [
  {
    label: "$",
    value: "$",
  },
  {
    label: "$$",
    value: "$$",
  },
  {
    label: "$$$",
    value: "$$$",
  },
];

const FilterPrice: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedPrices, setSelectedPrices] = useState<string[]>([]);

  const handleToggle = (value: string) => {
    const currentParams = new URLSearchParams(searchParams.toString());
    let updated: string[];

    if (selectedPrices.includes(value)) {
      updated = selectedPrices.filter((v) => v !== value);
    } else {
      updated = [...selectedPrices, value];
    }

    if (updated.length > 0) {
      currentParams.set("price", updated.join(","));
    } else {
      currentParams.delete("price");
    }

    setSelectedPrices(updated);
    router.push(`/market?${currentParams.toString()}`);
  };

  useEffect(() => {
    const prices = searchParams.get("price");

    if (prices) {
      setSelectedPrices(prices.split(","));
    } else {
      setSelectedPrices([]);
    }
  }, [searchParams]);

  return (
    <div className="w-full flex flex-col gap-y-3 px-[2px]">
      <span className="text-[15px] font-medium text-neutral-700">Price</span>
      <div className="w-full grid grid-cols-3 gap-1.5">
        {BUTTONS.map((button, index) => (
          <button
            type="button"
            key={index}
            onClick={() => handleToggle(button.value)}
            className={cn(
              "w-full text-[13px] font-medium text-neutral-900 rounded-full flex items-center justify-center py-1.5 border border-neutral-300/75 hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer hover:bg-neutral-100/90",
              {
                "bg-primary text-white hover:bg-primary/75 border-primary hover:border-primary/75":
                  selectedPrices.includes(button.value),
              }
            )}
          >
            {button.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterPrice;
