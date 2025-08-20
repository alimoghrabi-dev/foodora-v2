"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

const FILTERS = [
  {
    label: "Ratings 4+",
    value: "ratings_4_plus",
  },
];

const QuickFilter: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleClick = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (params.get(key) === value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    router.push(`/market?${params.toString()}`);
  };

  return (
    <div className="w-full flex flex-col gap-y-2">
      <span className="text-[15px] font-medium text-neutral-700">
        Quick Filters
      </span>
      {FILTERS.map((filter) => {
        const isActive = searchParams.get("quick_filter") === filter.value;

        return (
          <button
            key={filter.label}
            type="button"
            onClick={() => handleClick("quick_filter", filter.value)}
            className={cn(
              "w-fit cursor-pointer rounded-full px-4 flex items-center text-base font-medium text-neutral-800 border border-neutral-300 py-1 transition-all",

              isActive
                ? "bg-primary text-white hover:bg-primary/75 border-primary hover:border-primary/75"
                : "hover:bg-neutral-100 hover:border-neutral-400/60"
            )}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
};

export default QuickFilter;
