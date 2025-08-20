"use client";

import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useRouter, useSearchParams } from "next/navigation";
import { Label } from "@/components/ui/label";

const SORTINGS = [
  {
    label: "Relevance",
    value: "relevance",
  },
  {
    label: "Fastest Delivery",
    value: "fastest_delivery",
  },
  {
    label: "Distance",
    value: "distance",
  },
  {
    label: "Top Rated",
    value: "top_rated",
  },
];

const FilterSortBy: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get("sort") || "relevance";

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === currentSort) return;

    if (value === "relevance") {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }

    router.push(`/market?${params.toString()}`);
  };

  return (
    <div className="w-full flex flex-col gap-y-2">
      <span className="text-[15px] font-medium text-neutral-700">Sort By</span>
      <RadioGroup
        value={currentSort}
        onValueChange={handleChange}
        defaultValue="relevance"
      >
        {SORTINGS.map((sort, index) => (
          <div key={index} className="w-full flex items-center gap-x-2 group">
            <RadioGroupItem
              value={sort.value}
              id={`sort-${index}`}
              className="cursor-pointer size-5 group-hover:border-neutral-400 transition"
            />
            <Label
              htmlFor={`sort-${index}`}
              className="text-base font-medium text-neutral-800 cursor-pointer group-hover:text-neutral-600 transition"
            >
              {sort.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default FilterSortBy;
